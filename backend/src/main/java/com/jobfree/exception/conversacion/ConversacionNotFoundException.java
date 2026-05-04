package com.jobfree.exception.conversacion;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ConversacionNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ConversacionNotFoundException(Long id) {
        super("Conversación no encontrada con id: " + id);
    }
}
