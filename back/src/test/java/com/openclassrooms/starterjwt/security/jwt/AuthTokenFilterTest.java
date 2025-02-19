package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Classe de test d'intégration pour le filtre {@link AuthTokenFilter}.
 *
 * <p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Requête sans token</li>
 *         <li>Requête avec un token invalide</li>
 *         <li>Requête avec un token valide</li>
 *     </ul>
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthTokenFilterTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private UserRepository userRepository;

	@BeforeEach
	void setUp() {
		userRepository.deleteAll();

		User user = new User();
		user.setEmail("yoga@studio.com");
		user.setPassword("$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq");
		user.setFirstName("Admin");
		user.setLastName("Admin");
		user.setAdmin(true);

		userRepository.save(user);
	}

	@AfterEach
	void cleanUp() {
		userRepository.deleteAll();
	}


	@Test
	@DisplayName("Request without token - should return 401 Unauthorized")
	void testRequestWithoutToken() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Full authentication is required to access this resource"));
	}

	@Test
	@DisplayName("Request with invalid token - should return 401 Unauthorized")
	void testRequestWithInvalidToken() throws Exception {
		mockMvc.perform(get("/api/session")
				.header("Authorization", "Bearer token"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Request with valid token - should return 200 OK")
	void testRequestWithValidToken() throws Exception {

		UserDetails userDetails = userDetailsService.loadUserByUsername("yoga@studio.com");
		Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
		String token = jwtUtils.generateJwtToken(auth);

		assertTrue(jwtUtils.validateJwtToken(token));

		mockMvc.perform(get("/api/session")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

}