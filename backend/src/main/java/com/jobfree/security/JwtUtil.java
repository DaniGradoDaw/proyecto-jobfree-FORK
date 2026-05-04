package com.jobfree.security;

import java.security.Key;
import java.time.Duration;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

/**
 * Clase util para trabajar con JWT:
 * - Generar token
 * - Validar token
 * - Extraer datos (email)
 */
@Component
public class JwtUtil {

	@Value("${jwt.secret}")
	private String secreto;

	@Value("${cookie.secure:false}")
	private boolean cookieSecure;

	@PostConstruct
	public void validarSecreto() {
		if (secreto == null || secreto.getBytes().length < 32) {
			throw new IllegalStateException(
				"jwt.secret debe tener al menos 32 caracteres. Longitud actual: "
				+ (secreto == null ? 0 : secreto.length()));
		}
	}

	/**
	 * Genera la clave de firma a partir del secreto.
	 */
	private Key obtenerClave() {
		return Keys.hmacShaKeyFor(secreto.getBytes());
	}

	/**
	 * Genera un token JWT con el email del usuario.
	 *
	 * @param email email del usuario autenticado
	 * @return token válido durante 2 horas
	 */
	public String generarToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 7_200_000)) // 2 horas
				.signWith(obtenerClave())
				.compact();
	}

	/**
	 * Comprueba si el token es válido.
	 * Si está caducado o manipulado, devuelve false.
	 *
	 * @param token token JWT
	 * @return true si es válido, false si no
	 */
	public boolean esTokenValido(String token) {
		try {
			Jwts.parserBuilder()
					.setSigningKey(obtenerClave())
					.build()
					.parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public ResponseCookie crearCookieJwt(String token) {
		return ResponseCookie.from("jf_token", token)
				.httpOnly(true)
				.secure(cookieSecure)
				.path("/")
				.maxAge(Duration.ofHours(2))
				.sameSite("Lax")
				.build();
	}

	public ResponseCookie limpiarCookieJwt() {
		return ResponseCookie.from("jf_token", "")
				.httpOnly(true)
				.secure(cookieSecure)
				.path("/")
				.maxAge(0)
				.sameSite("Lax")
				.build();
	}

	public String extraerEmail(String token) {
		try {
			return Jwts.parserBuilder()
					.setSigningKey(obtenerClave())
					.build()
					.parseClaimsJws(token)
					.getBody()
					.getSubject();
		} catch (Exception e) {
			// Si falla (caducado, mal firmado...), devolvemos null
			return null;
		}
	}
}
