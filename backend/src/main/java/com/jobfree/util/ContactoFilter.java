package com.jobfree.util;

import java.util.regex.Pattern;

/**
 * Enmascara teléfonos y correos en mensajes para obligar a usar la plataforma.
 * Se aplica antes de persistir el contenido en BD.
 */
public final class ContactoFilter {

    private ContactoFilter() {}

    // Teléfonos españoles: 6XX, 7XX, 9XX con o sin prefijo +34 / 0034, separadores opcionales
    private static final Pattern TELEFONO = Pattern.compile(
        "(?:(?:\\+|00)\\s*34[\\s.\\-]?)?(?:6|7|9)\\d[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{2}[\\s.\\-]?\\d{2}",
        Pattern.CASE_INSENSITIVE
    );

    // Correos electrónicos estándar
    private static final Pattern EMAIL = Pattern.compile(
        "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
        Pattern.CASE_INSENSITIVE
    );

    public static String filtrar(String texto) {
        if (texto == null || texto.isBlank()) return texto;
        String resultado = TELEFONO.matcher(texto).replaceAll(m -> "*".repeat(m.group().length()));
        resultado = EMAIL.matcher(resultado).replaceAll(m -> "*".repeat(m.group().length()));
        return resultado;
    }
}
