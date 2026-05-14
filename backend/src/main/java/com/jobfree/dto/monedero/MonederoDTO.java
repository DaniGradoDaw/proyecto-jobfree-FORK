package com.jobfree.dto.monedero;

import java.math.BigDecimal;

public class MonederoDTO {
    private Long id;
    private BigDecimal saldo;

    public MonederoDTO() {}

    public MonederoDTO(Long id, BigDecimal saldo) {
        this.id = id;
        this.saldo = saldo;
    }

    public Long getId() { return id; }
    public BigDecimal getSaldo() { return saldo; }
}
