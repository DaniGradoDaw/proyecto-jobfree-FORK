package com.jobfree.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobfree.exception.auth.TokenExpiradoException;
import com.jobfree.exception.auth.TokenInvalidoException;
import com.jobfree.model.entity.PasswordResetToken;
import com.jobfree.model.entity.Usuario;
import com.jobfree.repository.PasswordResetTokenRepository;
import com.jobfree.repository.UsuarioRepository;

import jakarta.mail.internet.MimeMessage;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${reset.token.expiracion-minutos:30}")
    private int expiracionMinutos;

    @Value("${spring.mail.username}")
    private String mailFrom;

    public PasswordResetService(UsuarioRepository usuarioRepository,
                                PasswordResetTokenRepository tokenRepository,
                                JavaMailSender mailSender,
                                PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Si el email existe, genera un token y envía el correo de recuperación.
     * Si no existe, no revelamos esa información (respuesta siempre 200).
     */
    @Transactional
    public void solicitarReset(String email) {
        usuarioRepository.findByEmail(email).ifPresent(usuario -> {
            String token = UUID.randomUUID().toString();
            LocalDateTime expiracion = LocalDateTime.now().plusMinutes(expiracionMinutos);
            tokenRepository.save(new PasswordResetToken(token, usuario, expiracion));
            enviarEmail(usuario, token);
        });
    }

    /**
     * Valida el token y actualiza la contraseña del usuario.
     */
    @Transactional
    public void resetearPassword(String token, String nuevaPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(TokenInvalidoException::new);

        if (resetToken.isUsado()) {
            throw new TokenInvalidoException();
        }

        if (resetToken.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new TokenExpiradoException();
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        resetToken.setUsado(true);
        tokenRepository.save(resetToken);
    }

    private void enviarEmail(Usuario usuario, String token) {
        try {
            String enlace = frontendUrl + "/reset-password?token=" + token;

            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(usuario.getEmail());
            helper.setSubject("Recupera tu contraseña — JobFree");
            helper.setText(construirHtml(usuario.getNombre(), enlace), true);

            mailSender.send(mensaje);
            log.info("Email de recuperación enviado a {}", usuario.getEmail());
        } catch (Exception e) {
            log.error("Error al enviar email de recuperación a {}: {}", usuario.getEmail(), e.getMessage(), e);
        }
    }

    private String construirHtml(String nombre, String enlace) {
        int anio = java.time.Year.now().getValue();
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head><meta charset="UTF-8"></head>
                <body style="font-family:sans-serif;background:#f4f4f4;padding:40px 0">
                  <div style="max-width:480px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
                    <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px;text-align:center">
                      <h1 style="color:#fff;margin:0;font-size:24px">JobFree</h1>
                    </div>
                    <div style="padding:32px">
                      <h2 style="color:#1f2937;margin-top:0">Hola, %s</h2>
                      <p style="color:#6b7280">Recibimos una solicitud para restablecer tu contraseña.</p>
                      <p style="color:#6b7280">Haz clic en el botón para crear una nueva. El enlace es válido durante <strong>%d minutos</strong>.</p>
                      <div style="text-align:center;margin:32px 0">
                        <a href="%s"
                           style="background:#10b981;color:#fff;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:600;font-size:15px">
                          Restablecer contraseña
                        </a>
                      </div>
                      <p style="color:#9ca3af;font-size:13px">Si no solicitaste este cambio, ignora este correo. Tu contraseña no cambiará.</p>
                    </div>
                    <div style="background:#f9fafb;padding:16px;text-align:center">
                      <p style="color:#d1d5db;font-size:12px;margin:0">© %d JobFree · Todos los derechos reservados</p>
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(nombre, expiracionMinutos, enlace, anio);
    }
}
