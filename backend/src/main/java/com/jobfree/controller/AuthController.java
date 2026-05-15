package com.jobfree.controller;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobfree.dto.auth.ForgotPasswordDTO;
import com.jobfree.dto.auth.LoginDTO;
import com.jobfree.dto.auth.ResetPasswordDTO;
import com.jobfree.dto.usuario.UsuarioDTO;
import com.jobfree.mapper.UsuarioMapper;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.security.JwtUtil;
import com.jobfree.service.AuthService;
import com.jobfree.service.PasswordResetService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;
	private final JwtUtil jwtUtil;
	private final PasswordResetService passwordResetService;

	public AuthController(AuthService authService, JwtUtil jwtUtil, PasswordResetService passwordResetService) {
		this.authService = authService;
		this.jwtUtil = jwtUtil;
		this.passwordResetService = passwordResetService;
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> login(
			@Valid @RequestBody LoginDTO dto,
			HttpServletResponse response) {
		Usuario usuario = authService.login(dto.getEmail(), dto.getPassword());
		String token = jwtUtil.generarToken(usuario.getEmail());
		response.addHeader(HttpHeaders.SET_COOKIE, jwtUtil.crearCookieJwt(token).toString());
		return ResponseEntity.ok(Map.of("usuario", UsuarioMapper.toDTO(usuario), "token", token));
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletResponse response) {
		response.addHeader(HttpHeaders.SET_COOKIE, jwtUtil.limpiarCookieJwt().toString());
		return ResponseEntity.noContent().build();
	}

	/**
	 * Guarda el rol deseado en una cookie httpOnly antes de iniciar el flujo OAuth2.
	 * Se usa cookie en lugar de sesión porque la política de sesión es STATELESS.
	 * SameSite=Lax permite que se envíe en la redirección cross-site de Google → backend.
	 */
	@PostMapping("/iniciar-oauth")
	public ResponseEntity<Void> iniciarOAuth(
			@RequestBody Map<String, String> body,
			HttpServletResponse response) {
		String rolStr = body.get("rol");
		if (rolStr != null) {
			try {
				Rol rol = Rol.valueOf(rolStr.toUpperCase());
				if (rol != Rol.ADMIN) {
					response.addHeader(HttpHeaders.SET_COOKIE,
						ResponseCookie.from("oauth2_rol", rol.name())
							.httpOnly(true)
							.path("/")
							.maxAge(Duration.ofMinutes(5))
							.sameSite("Lax")
							.build().toString());
				}
			} catch (IllegalArgumentException ignored) {}
		}
		return ResponseEntity.ok().build();
	}

	/**
	 * Solicita un enlace de recuperación de contraseña.
	 * Siempre responde 200 para no revelar si el email existe.
	 */
	@PostMapping("/forgot-password")
	public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO dto) {
		passwordResetService.solicitarReset(dto.getEmail());
		return ResponseEntity.ok(Map.of("mensaje", "Si el correo está registrado recibirás un enlace en breve."));
	}

	/**
	 * Valida el token y actualiza la contraseña.
	 */
	@PostMapping("/reset-password")
	public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordDTO dto) {
		passwordResetService.resetearPassword(dto.getToken(), dto.getNuevaPassword());
		return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente."));
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/me")
	public ResponseEntity<UsuarioDTO> getMe() {
		Usuario usuario = (Usuario) SecurityContextHolder
				.getContext()
				.getAuthentication()
				.getPrincipal();
		return ResponseEntity.ok(UsuarioMapper.toDTO(usuario));
	}

	@PreAuthorize("isAuthenticated()")
	@PostMapping("/refresh")
	public ResponseEntity<Map<String, Object>> refresh(HttpServletResponse response) {
		Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String token = jwtUtil.generarToken(usuario.getEmail());
		response.addHeader(HttpHeaders.SET_COOKIE, jwtUtil.crearCookieJwt(token).toString());
		return ResponseEntity.ok(Map.of("token", token));
	}
}
