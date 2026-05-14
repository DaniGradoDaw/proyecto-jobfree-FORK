package com.jobfree.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.jobfree.model.entity.Monedero;
import com.jobfree.model.entity.MovimientoMonedero;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.TipoMovimiento;
import com.jobfree.repository.MonederoRepository;
import com.jobfree.repository.MovimientoMonederoRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class MonederoService {

    private final MonederoRepository monederoRepository;
    private final MovimientoMonederoRepository movimientoRepository;

    public MonederoService(MonederoRepository monederoRepository,
                           MovimientoMonederoRepository movimientoRepository) {
        this.monederoRepository = monederoRepository;
        this.movimientoRepository = movimientoRepository;
    }

    public Monedero obtenerOCrear(Usuario usuario) {
        return monederoRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> monederoRepository.save(new Monedero(usuario)));
    }

    public Monedero acreditar(Usuario usuario, BigDecimal importe, String concepto) {
        Monedero monedero = obtenerOCrear(usuario);
        monedero.setSaldo(monedero.getSaldo().add(importe));
        movimientoRepository.save(new MovimientoMonedero(monedero, TipoMovimiento.ENTRADA, concepto, importe));
        return monederoRepository.save(monedero);
    }

    public Monedero cargar(Usuario usuario, BigDecimal importe, String concepto) {
        Monedero monedero = obtenerOCrear(usuario);
        if (monedero.getSaldo().compareTo(importe) < 0) {
            throw new IllegalStateException("Saldo insuficiente en el monedero");
        }
        monedero.setSaldo(monedero.getSaldo().subtract(importe));
        movimientoRepository.save(new MovimientoMonedero(monedero, TipoMovimiento.SALIDA, concepto, importe));
        return monederoRepository.save(monedero);
    }

    public Monedero retirar(Usuario usuario, BigDecimal importe) {
        Monedero monedero = obtenerOCrear(usuario);
        if (monedero.getIban() == null || monedero.getIban().isBlank()) {
            throw new IllegalStateException("Debes configurar tu cuenta bancaria antes de retirar");
        }
        if (importe == null || importe.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El importe debe ser mayor que 0");
        }
        String destino = monedero.getIban().substring(0, 4) + "****";
        return cargar(usuario, importe, "Retirada a cuenta " + destino);
    }

    public List<MovimientoMonedero> listarMovimientos(Usuario usuario) {
        return movimientoRepository.findByMonederoUsuarioIdOrderByFechaDesc(usuario.getId());
    }

    public void guardarCuentaBancaria(Usuario usuario, String iban, String titular) {
        Monedero monedero = obtenerOCrear(usuario);
        monedero.setIban(iban);
        monedero.setTitular(titular);
        monederoRepository.save(monedero);
    }
}
