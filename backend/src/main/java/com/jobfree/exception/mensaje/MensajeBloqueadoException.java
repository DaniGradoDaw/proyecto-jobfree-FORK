package com.jobfree.exception.mensaje;

public class MensajeBloqueadoException extends RuntimeException {
    public MensajeBloqueadoException() {
        super("No puedes enviar mensajes a este usuario");
    }
}
