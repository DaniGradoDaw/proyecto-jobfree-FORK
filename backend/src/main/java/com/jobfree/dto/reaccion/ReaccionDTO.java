package com.jobfree.dto.reaccion;

import java.util.List;

public class ReaccionDTO {

    private String emoji;
    private int count;
    private List<Long> usuarioIds;

    public ReaccionDTO() {}

    public ReaccionDTO(String emoji, List<Long> usuarioIds) {
        this.emoji = emoji;
        this.usuarioIds = usuarioIds;
        this.count = usuarioIds.size();
    }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
    public List<Long> getUsuarioIds() { return usuarioIds; }
    public void setUsuarioIds(List<Long> usuarioIds) { this.usuarioIds = usuarioIds; }
}
