package com.jobfree.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.jobfree.model.entity.Usuario;
import com.jobfree.model.enums.Rol;
import com.jobfree.repository.UsuarioRepository;

@Component
public class DataInitializer implements ApplicationRunner {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	@Value("${admin.password:Admin1234!}")
	private String adminPassword;

	public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (usuarioRepository.existsByEmail("admin@jobfree.com")) return;

		Usuario admin = new Usuario();
		admin.setNombre("Admin");
		admin.setApellidos("JobFree");
		admin.setEmail("admin@jobfree.com");
		admin.setTelefono("+34600000001");
		admin.setPassword(passwordEncoder.encode(adminPassword));
		admin.setRol(Rol.ADMIN);
		usuarioRepository.save(admin);
	}
}
