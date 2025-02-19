package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 *  Classe de test d'intégration pour le contrôleur {@link UserController}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Récupération d'un utilisateur par son ID - succès</li>
 *         <li>Récupération d'un utilisateur par son ID - échec (non trouvée)</li>
 *         <li>Récupération d'un utilisateur par son ID - échec (format invalide)</li>
 *         <li>Suppression d'un utilisateur par son ID - succès</li>
 *         <li>Suppression d'un utilisateur par son ID - échec (non trouvée)</li>
 *         <li>Suppression d'un utilisateur par son ID - échec (non autorisé)</li>
 *     </ul>
 *</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	// Création d'un utilisateur de test
	private final User user = User.builder()
			.email("john.doe@example.com")
			.firstName("john")
			.lastName("doe")
			.password(new BCryptPasswordEncoder().encode("password"))
			.admin(false)
			.build();

	private final User userAdmin = User.builder()
			.email("admin@example.com")
			.firstName("chuck")
			.lastName("norris")
			.password(new BCryptPasswordEncoder().encode("password"))
			.admin(true)
			.build();

	@BeforeEach
	void setUp() {
		userRepository.deleteAll();
		userRepository.save(user);
		userRepository.save(userAdmin);
	}

	@AfterEach
	void cleanUp() {
		userRepository.deleteAll();
	}

	@Test
	@DisplayName("Successful find user by ID")
	@WithMockUser
		// Sumulation d'un utilisateur authentifié
	void testFindById_Success() throws Exception {
		Long id = user.getId();

		mockMvc.perform(get("/api/user/{id}", id))
				.andExpect(status().isOk())
				.andDo(print())
				.andExpect(jsonPath("$.email").value(user.getEmail()))
				.andExpect(jsonPath("$.firstName").value(user.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(user.getLastName()))
				.andExpect(jsonPath("$.admin").value(user.isAdmin()))
				.andExpect(jsonPath("$.createdAt").exists())
				.andExpect(jsonPath("$.updatedAt").exists())
				.andExpect(jsonPath("$.id").value(id));
	}

	@Test
	@DisplayName("Fail to find user by ID - Not found")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindById_NotFound() throws Exception {
		Long id = 101L;

		mockMvc.perform(get("/api/user/{id}", id))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Fail to find user by ID - Invalid format")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindById_InvalidFormat() throws Exception {

		mockMvc.perform(get("/api/user/{id}", "invalid-format"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Successful delete user")
	@WithMockUser(username = "john.doe@example.com") // Sumulation d'un utilisateur authentifié
	void testDelete_Success() throws Exception {
		Long id = user.getId();

		mockMvc.perform(delete("/api/user/{id}", id))
				.andExpect(status().isOk());
	}

	@Test
	@DisplayName("Fail to delete user - Not found")
	@WithMockUser(username = "john.doe@example.com") // Sumulation d'un utilisateur authentifié
	void testDelete_NotFound() throws Exception {
		Long id = 101L;

		mockMvc.perform(delete("/api/user/{id}", id))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Fail to delete user - Unauthorized")
	@WithMockUser(username = "john.doe@example.com") // Sumulation d'un utilisateur authentifié
	void testDelete_Unauthorized() throws Exception {
		Long id = userAdmin.getId();

		mockMvc.perform(delete("/api/user/{id}", id))
				.andExpect(status().isUnauthorized());
	}
}
