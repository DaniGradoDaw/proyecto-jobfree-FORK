package com.jobfree.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.jobfree.security.CookieOAuth2AuthorizationRequestRepository;
import com.jobfree.security.JwtAuthenticationFilter;
import com.jobfree.security.OAuth2SuccessHandler;
import com.jobfree.security.RateLimitFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	@Value("${frontend.url}")
	private String frontendUrl;

	private final JwtAuthenticationFilter filtroJwt;
	private final OAuth2SuccessHandler oAuth2SuccessHandler;
	private final CookieOAuth2AuthorizationRequestRepository cookieAuthRequestRepo;
	private final RateLimitFilter rateLimitFilter;

	public SecurityConfig(JwtAuthenticationFilter filtroJwt,
	                      OAuth2SuccessHandler oAuth2SuccessHandler,
	                      CookieOAuth2AuthorizationRequestRepository cookieAuthRequestRepo,
	                      RateLimitFilter rateLimitFilter) {
		this.filtroJwt = filtroJwt;
		this.oAuth2SuccessHandler = oAuth2SuccessHandler;
		this.cookieAuthRequestRepo = cookieAuthRequestRepo;
		this.rateLimitFilter = rateLimitFilter;
	}

	/**
	 * CorsFilter registrado a la máxima prioridad en el filter chain del
	 * contenedor de servlet (FUERA de Spring Security).
	 * Esto garantiza que las cabeceras CORS se añaden a TODAS las respuestas,
	 * incluyendo los errores 401/403 que Spring Security genera antes de que
	 * el request llegue a los controladores.
	 */
	@Bean
	@Order(Integer.MIN_VALUE)
	public CorsFilter corsFilter() {
		return new CorsFilter(corsConfigurationSource());
	}

	@Bean
	public SecurityFilterChain configurarSeguridad(HttpSecurity http) throws Exception {

		http
			// El CorsFilter de nivel de contenedor ya cubre todo,
			// pero también lo configuramos dentro de Spring Security
			// para que los endpoints OAuth2 del propio framework también estén cubiertos.
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))
			// API REST stateless con JWT en cookies SameSite=Lax:
			// CSRF no es necesario porque el navegador no envía cookies Lax en peticiones POST cross-site.
			.csrf(csrf -> csrf.disable())
			.headers(headers -> headers
				.frameOptions(frame -> frame.deny())
				.contentSecurityPolicy(csp -> csp.policyDirectives(
					"default-src 'none'; " +
					"connect-src 'self'; " +
					"img-src 'self'; " +
					"object-src 'none'; " +
					"base-uri 'none'; " +
					"frame-ancestors 'none'"
				))
				.referrerPolicy(referrer -> referrer.policy(
					ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
				.permissionsPolicy(perms -> perms.policy(
					"camera=(), microphone=(), geolocation=(), payment=(self)"))
			)
			.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			)

			// Cuando un usuario no autenticado accede a un recurso protegido,
			// devolver 401 JSON en lugar de redirigir al login de OAuth2.
			// Sin esto, fetch() sigue la redirección hasta Google, recibe
			// un error CORS y lanza una excepción de red en el frontend.
			.exceptionHandling(ex -> ex
				.authenticationEntryPoint((request, response, authException) -> {
					response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					response.setContentType(MediaType.APPLICATION_JSON_VALUE);
					response.getWriter().write("{\"status\":401,\"error\":\"No autenticado\"}");
				})
				.accessDeniedHandler((request, response, accessDeniedException) -> {
					response.setStatus(HttpServletResponse.SC_FORBIDDEN);
					response.setContentType(MediaType.APPLICATION_JSON_VALUE);
					response.getWriter().write("{\"status\":403,\"error\":\"Acceso denegado\"}");
				})
			)

			.authorizeHttpRequests(auth -> auth

				.requestMatchers("/auth/**").permitAll()
				.requestMatchers("/oauth2/**").permitAll()
				.requestMatchers("/login/oauth2/**").permitAll()
				.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
				.requestMatchers("/pagos/stripe/webhook").permitAll()
				.requestMatchers("/actuator/health", "/actuator/info").permitAll()
				.requestMatchers("/actuator/**").hasRole("ADMIN")
				.requestMatchers("/usuarios/cliente").permitAll()
				.requestMatchers("/usuarios/profesional").permitAll()

				.requestMatchers("/uploads/**").permitAll()
				.requestMatchers("/categorias/**").permitAll()
				.requestMatchers("/subcategorias/**").permitAll()

				.requestMatchers(HttpMethod.GET, "/servicios/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/profesionales/**").permitAll()
				.requestMatchers(HttpMethod.GET, "/resenas/profesionales/**").permitAll()

				.requestMatchers(HttpMethod.POST, "/servicios").hasRole("PROFESIONAL")
				.requestMatchers(HttpMethod.PATCH, "/servicios/**").hasRole("PROFESIONAL")
				.requestMatchers(HttpMethod.DELETE, "/servicios/**").hasRole("PROFESIONAL")

				.anyRequest().authenticated()
			)
			.oauth2Login(oauth2 -> oauth2
				.authorizationEndpoint(endpoint ->
					endpoint.baseUri("/oauth2/authorization")
						.authorizationRequestRepository(cookieAuthRequestRepo)
				)
				.redirectionEndpoint(endpoint ->
					endpoint.baseUri("/login/oauth2/code/*")
				)
				.failureHandler((request, response, exception) ->
					response.sendRedirect(frontendUrl + "/login?error=oauth")
				)
				.successHandler(oAuth2SuccessHandler)
			)
			.addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
			.addFilterBefore(filtroJwt, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(List.of(frontendUrl));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		// Cabeceras que el frontend puede enviar
		config.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept", "X-Requested-With", "X-XSRF-TOKEN"));
		config.setExposedHeaders(List.of("Authorization"));
		config.setAllowCredentials(true);
		// Cache de preflight 5 minutos
		config.setMaxAge(300L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);

		return source;
	}
}
