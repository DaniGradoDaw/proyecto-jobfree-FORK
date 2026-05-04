package com.jobfree.exception;

import com.jobfree.exception.auth.CredencialesInvalidasException;
import com.jobfree.exception.auth.TokenExpiradoException;
import com.jobfree.exception.auth.TokenInvalidoException;
import com.jobfree.exception.categoria.CategoriaDuplicadaException;
import com.jobfree.exception.categoria.CategoriaNotFoundException;
import com.jobfree.exception.conversacion.ConversacionAccesoException;
import com.jobfree.exception.conversacion.ConversacionNotFoundException;
import com.jobfree.exception.mensaje.MensajeBloqueadoException;
import com.jobfree.exception.mensaje.MensajeNotFoundException;
import com.jobfree.exception.notificacion.NotificacionNotFoundException;
import com.jobfree.exception.pago.PagoInvalidoException;
import com.jobfree.exception.pago.PagoNotFoundException;
import com.jobfree.exception.profesional.ProfesionalInvalidoException;
import com.jobfree.exception.profesional.ProfesionalNotFoundException;
import com.jobfree.exception.reserva.ReservaInvalidaException;
import com.jobfree.exception.reserva.ReservaNotFoundException;
import com.jobfree.exception.servicio.ServicioInvalidoException;
import com.jobfree.exception.servicio.ServicioNotFoundException;
import com.jobfree.exception.subcategoria.CategoriaObligatoriaException;
import com.jobfree.exception.subcategoria.SubcategoriaNotFoundException;
import com.jobfree.exception.usuario.UsuarioAdminNoPermitidoException;
import com.jobfree.exception.usuario.UsuarioDuplicadoException;
import com.jobfree.exception.usuario.UsuarioNotFoundException;
import com.jobfree.exception.valoracion.ValoracionInvalidaException;
import com.jobfree.exception.valoracion.ValoracionNotFoundException;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ------------------------------------------------------------------ 401 / 403  (Spring Security method security)
    // AccessDeniedException (padre de AuthorizationDeniedException de Spring Security 6.3+)
    // debe capturarse AQUÍ antes del catch-all para no devolver 500.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean esAnonimo = auth == null
                || !auth.isAuthenticated()
                || auth instanceof AnonymousAuthenticationToken;
        if (esAnonimo) {
            return build(HttpStatus.UNAUTHORIZED, "No autenticado", req);
        }
        return build(HttpStatus.FORBIDDEN, "Acceso denegado", req);
    }

    // ------------------------------------------------------------------ 401
    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<ApiError> handleUnauthorized(CredencialesInvalidasException ex, HttpServletRequest req) {
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage(), req);
    }

    // ------------------------------------------------------------------ 400 (token reset)
    @ExceptionHandler({TokenInvalidoException.class, TokenExpiradoException.class})
    public ResponseEntity<ApiError> handleTokenReset(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    // ------------------------------------------------------------------ 404
    @ExceptionHandler({
        UsuarioNotFoundException.class,
        CategoriaNotFoundException.class,
        SubcategoriaNotFoundException.class,
        ServicioNotFoundException.class,
        ReservaNotFoundException.class,
        PagoNotFoundException.class,
        ProfesionalNotFoundException.class,
        MensajeNotFoundException.class,
        NotificacionNotFoundException.class,
        ValoracionNotFoundException.class,
        ConversacionNotFoundException.class
    })
    public ResponseEntity<ApiError> handleNotFound(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    // ------------------------------------------------------------------ 400
    @ExceptionHandler({
        PagoInvalidoException.class,
        ProfesionalInvalidoException.class,
        ReservaInvalidaException.class,
        ServicioInvalidoException.class,
        ValoracionInvalidaException.class,
        CategoriaObligatoriaException.class,
        IllegalArgumentException.class
    })
    public ResponseEntity<ApiError> handleBadRequest(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req);
    }

    // ------------------------------------------------------------------ 400 (validación @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        ApiError body = ApiError.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message("Errores de validación")
                .path(req.getRequestURI())
                .errors(fieldErrors)
                .build();

        return ResponseEntity.badRequest().body(body);
    }

    // ------------------------------------------------------------------ 409
    @ExceptionHandler({
        UsuarioDuplicadoException.class,
        CategoriaDuplicadaException.class
    })
    public ResponseEntity<ApiError> handleConflict(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), req);
    }

    // ------------------------------------------------------------------ 403
    @ExceptionHandler({UsuarioAdminNoPermitidoException.class, ConversacionAccesoException.class, MensajeBloqueadoException.class})
    public ResponseEntity<ApiError> handleForbidden(RuntimeException ex, HttpServletRequest req) {
        return build(HttpStatus.FORBIDDEN, ex.getMessage(), req);
    }

    // ------------------------------------------------------------------ 404 (ruta no encontrada)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> handleNoResource(NoResourceFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "Recurso no encontrado", req);
    }

    // ------------------------------------------------------------------ 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", req);
    }

    // ------------------------------------------------------------------ helper
    private ResponseEntity<ApiError> build(HttpStatus status, String message, HttpServletRequest req) {
        ApiError body = ApiError.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(body);
    }
}
