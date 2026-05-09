package com.jobfree.dto.realtime;

import com.jobfree.dto.reaccion.ReaccionDTO;
import java.util.List;

public class MensajeReaccionEventDTO {

    private final String tipo = "mensaje.reaccion";
    private final Long conversacionId;
    private final Long mensajeId;
    private final List<ReaccionDTO> reacciones;

    public MensajeReaccionEventDTO(Long conversacionId, Long mensajeId, List<ReaccionDTO> reacciones) {
        this.conversacionId = conversacionId;
        this.mensajeId = mensajeId;
        this.reacciones = reacciones;
    }

    public String getTipo() { return tipo; }
    public Long getConversacionId() { return conversacionId; }
    public Long getMensajeId() { return mensajeId; }
    public List<ReaccionDTO> getReacciones() { return reacciones; }
}
