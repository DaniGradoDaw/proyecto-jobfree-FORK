package com.jobfree.exception.conversacion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ConversacionAccesoException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ConversacionAccesoException() {
        super("No tienes acceso a esta conversación");
    }
}
