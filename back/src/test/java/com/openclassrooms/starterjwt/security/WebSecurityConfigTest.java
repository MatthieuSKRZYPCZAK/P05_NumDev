package com.openclassrooms.starterjwt.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 *  Classe de test d'intégration pour {@link WebSecurityConfig}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Accès refusé à un endpoint protégé sans authentification</li>
 *         <li>Accès autorisé à un endpoint protégé avec un utilisateur authentifié</li>
 *     </ul>
 *</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WebSecurityConfigTest {

	@Autowired
	private MockMvc mockMvc;


	@Test
	@DisplayName("Access to /api/session should be denied without authentication")
	void testProtectedEndpoint() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Authenticated user should access /api/session")
	@WithMockUser(username = "user")
	void testAuthenticatedAccess() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpect(status().isOk());
	}

}