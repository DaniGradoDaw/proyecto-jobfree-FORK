package com.jobfree.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.jobfree.dto.profesional.ProfesionalCreateDTO;
import com.jobfree.model.entity.ProfesionalInfo;
import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Plan;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.ProfesionalInfoRepository;

@ExtendWith(MockitoExtension.class)
class ProfesionalInfoServiceTest {

	@Mock ProfesionalInfoRepository profesionalInfoRepository;
	@Mock GeocodingService geocodingService;

	@InjectMocks ProfesionalInfoService profesionalInfoService;

	private Usuario usuario;
	private ProfesionalInfo perfil;

	@BeforeEach
	void setUp() {
		usuario = new Usuario();
		setId(usuario, 1L);
		usuario.setRol(Rol.PROFESIONAL);

		perfil = new ProfesionalInfo();
		setId(perfil, 10L);
		perfil.setUsuario(usuario);
		perfil.setDescripcion("Perfil actual");
		perfil.setExperiencia(2);
		perfil.setPlan(Plan.BASICO);
	}

	@Test
	void guardarPerfil_ignoraPlanDelPayloadYFuerzaBasico() {
		perfil.setPlan(Plan.PREMIUM);
		when(profesionalInfoRepository.findByUsuarioId(1L)).thenReturn(Optional.empty());
		when(profesionalInfoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

		ProfesionalInfo guardado = profesionalInfoService.guardarPerfil(perfil);

		assertThat(guardado.getPlan()).isEqualTo(Plan.BASICO);
	}

	@Test
	void actualizarPerfil_ignoraPlanDelPayload() {
		ProfesionalCreateDTO dto = new ProfesionalCreateDTO();
		dto.setDescripcion("Perfil editado");
		dto.setExperiencia(5);
		dto.setPlan(Plan.PREMIUM);

		when(profesionalInfoRepository.findById(10L)).thenReturn(Optional.of(perfil));
		when(profesionalInfoRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

		ProfesionalInfo actualizado = profesionalInfoService.actualizarPerfil(10L, dto, usuario);

		assertThat(actualizado.getDescripcion()).isEqualTo("Perfil editado");
		assertThat(actualizado.getExperiencia()).isEqualTo(5);
		assertThat(actualizado.getPlan()).isEqualTo(Plan.BASICO);
	}

	private static void setId(Object obj, Long id) {
		try {
			var field = obj.getClass().getDeclaredField("id");
			field.setAccessible(true);
			field.set(obj, id);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
