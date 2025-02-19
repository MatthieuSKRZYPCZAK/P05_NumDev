package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 *  Classe de test d'intégration pour le contrôleur {@link AuthController}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Authentification réussie d'un utilisateur existant</li>
 *         <li>Échec de l'authentification avec des identifiants incorrects</li>
 *         <li>Échec de l'authentification avec un format invalide</li>
 *         <li>Inscription réussie d'un nouvel utilisateur</li>
 *         <li>Échec de l'inscription lorsque l'email est déjà utilisé</li>
 *         <li>Échec de l'inscription avec plusieurs champs vides</li>
 *     </ul>
 *</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ObjectMapper objectMapper;

	// Création d'un utilisateur de test
	private final User user = User.builder()
			.email("john.doe@example.com")
			.firstName("john")
			.lastName("doe")
			.password(new BCryptPasswordEncoder().encode("password"))
			.admin(false)
			.build();

	@BeforeEach
	void setUp() {
		userRepository.deleteAll(); // Nettoyage de la base avant chaque test
		userRepository.save(user); // Enregistrement d'un utilisateur de test
	}

	@Test
	@DisplayName("Successful user authentication") // Authentification réussie d'un utilisateur existant
	void testAuthenticateUser_Success() throws Exception {
		LoginRequest request = new LoginRequest();
		request.setEmail("john.doe@example.com");
		request.setPassword("password");

		// Conversion en JSON
		String jsonRequest = objectMapper.writeValueAsString(request);

		mockMvc.perform(post("/api/auth/login")
						.content(jsonRequest)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").exists())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.username").value("john.doe@example.com"))
				.andExpect(jsonPath("$.firstName").value("john"))
				.andExpect(jsonPath("$.lastName").value("doe"))
				.andExpect(jsonPath("$.admin").value(false));
	}

	@Test
	@DisplayName("Fail authentication with incorrect credentials") // Échec de l'authentification avec des identifiants incorrects
	void testAuthenticateUser_InvalidCredentials() throws Exception {
		LoginRequest request = new LoginRequest();
		request.setEmail("john.doe@example.com");
		request.setPassword("wrongpassword");

		// Conversion en JSON
		String jsonRequest = objectMapper.writeValueAsString(request);

		mockMvc.perform(post("/api/auth/login")
						.content(jsonRequest)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Fail authentication with invalid format.") // Échec de l'authentification avec un format invalide
	void testAuthenticateUser_BadRequest() throws Exception {
		LoginRequest request = new LoginRequest();
		request.setEmail("");
		request.setPassword("password");

		// Conversion en JSON
		String jsonRequest = objectMapper.writeValueAsString(request);

		mockMvc.perform(post("/api/auth/login")
						.content(jsonRequest)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Successful user registration") // Inscription réussie d'un nouvel utilisateur
	void testRegisterUser_Success() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("jane.doe@example.com");
		signupRequest.setFirstName("Jane");
		signupRequest.setLastName("Doe");
		signupRequest.setPassword("password");

		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.message").value("User registered successfully!"));
	}

	@Test
	@DisplayName("Fail registration when email is already taken") // Échec de l'inscription lorsque l'email est déjà utilisé
	void testRegisterUser_EmailAlreadyExists() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("john.doe@example.com"); // Cet email existe déjà dans setUp()
		signupRequest.setFirstName("John");
		signupRequest.setLastName("Doe");
		signupRequest.setPassword("password");

		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
	}

	@Test
	@DisplayName("Fail registration with multiple empty fields") // Échec de l'inscription avec plusieurs champs vides
	void testRegisterUser_BadRequest() throws Exception {
		SignupRequest signupRequest = new SignupRequest();
		signupRequest.setEmail("");
		signupRequest.setFirstName("");
		signupRequest.setLastName("");
		signupRequest.setPassword("");

		mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(signupRequest)))
				.andExpect(status().isBadRequest());
	}
}