package com.openclassrooms.starterjwt.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 *  Classe de test d'intégration pour le contrôleur {@link SessionController}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Récupération d'une session par ID - succès</li>
 *         <li>Récupération d'une session par ID - échec (non trouvée)</li>
 *         <li>Récupétation de toutes les sessions - succès</li>
 *         <li>Création d'une session - succès</li>
 *         <li>Création d'une session - échec (requête invalide)</li>
 *         <li>Mise à jour d'une session - succès</li>
 *         <li>Mise à jour d'une session - échec (requête invalide)</li>
 *         <li>Suppression d'une session - succès</li>
 *         <li>Suppression d'une session - échec (session inexistante)</li>
 *         <li>Suppression d'une session - échec (format invalide)</li>
 *         <li>Participation à une session - succès</li>
 *         <li>Participation à une session - échec (format invalide)</li>
 *         <li>Annulation de la participation à une session - succès</li>
 *     </ul>
 *</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SessionControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TeacherRepository teacherRepository;

	@Autowired
	private SessionRepository sessionRepository;

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

	private final Teacher teacher = Teacher.builder()
			.firstName("Albus")
			.lastName("Dumbledore")
			.createdAt(LocalDateTime.now())
			.build();

	private final Session sessionOne = Session.builder()
			.name("Session Test 1")
			.description("Session description Test 1")
			.teacher(teacher)
			.date(Date.from(LocalDateTime.of(2025, 5, 14, 10, 0)
					.atZone(ZoneId.systemDefault())
					.toInstant()))
			.createdAt(LocalDateTime.now())
			.build();

	private final Session sessionTwo = Session.builder()
			.name("Session Test 2")
			.description("Session description Test 2")
			.teacher(teacher)
			.date(Date.from(LocalDateTime.of(2025, 5, 22, 8, 0)
					.atZone(ZoneId.systemDefault())
					.toInstant()))
			.createdAt(LocalDateTime.now())
			.build();


	@BeforeEach
	void setUp() {
		userRepository.deleteAll();
		teacherRepository.deleteAll();
		sessionRepository.deleteAll();
		userRepository.save(user);
		teacherRepository.save(teacher);

		Session savedSessionOne = sessionRepository.save(sessionOne);
		sessionOne.setId(savedSessionOne.getId());

		Session savedSessionTwo = sessionRepository.save(sessionTwo);
		sessionTwo.setId(savedSessionTwo.getId());
	}

	@AfterEach
	void cleanUp() {
		sessionRepository.deleteAll();
		userRepository.deleteAll();
	}


	@Test
	@DisplayName("Successful find session by ID")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindById_Success() throws Exception {
		Long id = sessionOne.getId();

		mockMvc.perform(get("/api/session/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(sessionOne.getId()))
				.andExpect(jsonPath("$.name").value(sessionOne.getName()))
				.andExpect(jsonPath("$.description").value(sessionOne.getDescription()))
				.andExpect(jsonPath("$.teacher_id").value(teacher.getId()))
				.andExpect(jsonPath("$.date").exists())
				.andExpect(jsonPath("$.createdAt").exists())
				.andExpect(jsonPath("$.updatedAt").exists())
				.andExpect(jsonPath("$.users").isArray())
				.andExpect(jsonPath("$.users").isEmpty());
	}

	@Test
	@DisplayName("Fail to find session by ID")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindById_NotFound() throws Exception {
		Long id = 10L;

		mockMvc.perform(get("/api/session/{id}", id))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Successful find all sessions")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindAll_Success() throws Exception {
		mockMvc.perform(get("/api/session"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(2)) // Vérifie qu'il y a bien 2 sessions
				.andExpect(jsonPath("$[0].name").value(sessionOne.getName()))
				.andExpect(jsonPath("$[1].name").value(sessionTwo.getName()));
	}

	@Test
	@DisplayName("Successful create session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testCreate_Success() throws Exception {

		SessionDto newSessionDto = new SessionDto();
		newSessionDto.setName("New Session");
		newSessionDto.setDescription("New description");
		newSessionDto.setTeacher_id(teacher.getId());
		newSessionDto.setDate(Date.from(LocalDateTime.of(2025, 4, 11, 9, 0)
				.atZone(ZoneId.systemDefault())
				.toInstant()));

		String jsonRequest = objectMapper.writeValueAsString(newSessionDto);
		mockMvc.perform(post("/api/session")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.name").value("New Session"))
				.andExpect(jsonPath("$.description").value("New description"))
				.andExpect(jsonPath("$.teacher_id").value(teacher.getId()))
				.andExpect(jsonPath("$.date").exists())
				.andExpect(jsonPath("$.createdAt").exists())
				.andExpect(jsonPath("$.updatedAt").exists())
				.andExpect(jsonPath("$.users").isArray())
				.andExpect(jsonPath("$.users").isEmpty())
		;
	}

	@Test
	@DisplayName("Fail to create session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testCreate_BadRequest() throws Exception {

		SessionDto newSessionDto = new SessionDto();
		newSessionDto.setName("New Session");
		newSessionDto.setTeacher_id(teacher.getId());
		newSessionDto.setDate(Date.from(LocalDateTime.of(2025, 4, 11, 9, 0)
				.atZone(ZoneId.systemDefault())
				.toInstant()));

		String jsonRequest = objectMapper.writeValueAsString(newSessionDto);
		mockMvc.perform(post("/api/session")
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Successful update session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testUpdate_Success() throws Exception {
		SessionDto updatedSessionDto = new SessionDto();
		updatedSessionDto.setName("Updated Session");
		updatedSessionDto.setDescription("Updated description");
		updatedSessionDto.setTeacher_id(teacher.getId());
		updatedSessionDto.setDate(Date.from(LocalDateTime.of(2025, 5, 14, 10, 0)
				.atZone(ZoneId.systemDefault())
				.toInstant()));

		String jsonRequest = objectMapper.writeValueAsString(updatedSessionDto);
		Long id = sessionOne.getId();

		mockMvc.perform(put("/api/session/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.name").value(updatedSessionDto.getName()))
				.andExpect(jsonPath("$.description").value(updatedSessionDto.getDescription()))
				.andExpect(jsonPath("$.teacher_id").value(updatedSessionDto.getTeacher_id()))
				.andExpect(jsonPath("$.date").exists())
				.andExpect(jsonPath("$.updatedAt").exists())
				.andExpect(jsonPath("$.users").isArray())
				.andExpect(jsonPath("$.users").isEmpty());
	}

	@Test
	@DisplayName("Fail to update session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testUpdate_BadRequest() throws Exception {
		SessionDto updatedSessionDto = new SessionDto();
		updatedSessionDto.setName("Updated Session");
		updatedSessionDto.setTeacher_id(teacher.getId());
		updatedSessionDto.setDate(Date.from(LocalDateTime.of(2025, 5, 14, 10, 0)
				.atZone(ZoneId.systemDefault())
				.toInstant()));

		String jsonRequest = objectMapper.writeValueAsString(updatedSessionDto);
		Long id = sessionOne.getId();

		mockMvc.perform(put("/api/session/{id}", id)
						.contentType(MediaType.APPLICATION_JSON)
						.content(jsonRequest))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Successful delete session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testDelete_Success() throws Exception {
		Long id = sessionOne.getId();

		mockMvc.perform(delete("/api/session/{id}", id))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/session"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1)) // Vérifie qu'il y a bien 1 session
				.andExpect(jsonPath("$[0].name").value(sessionTwo.getName()));
	}

	@Test
	@DisplayName("Fail to delete session - Not Found")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testDelete_NotFound() throws Exception {
		Long id = 101L;

		mockMvc.perform(delete("/api/session/{id}", id))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Fail to delete session - Invalid Format")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testDelete_InvalidFormat() throws Exception {
		mockMvc.perform(delete("/api/session/{id}", "invalid-format"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Successful participate in session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testParticipate_Success() throws Exception {
		Long sessionId = sessionOne.getId();
		Long userId = user.getId();

		mockMvc.perform(post("/api/session/{sessionId}/participate/{userId}", sessionId, userId))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/session/{sessionId}", sessionId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users").isArray())
				.andExpect(jsonPath("$.users.length()").value(1))
				.andExpect(jsonPath("$.users[0]").value(userId));
	}

	@Test
	@DisplayName("Fail to participate in session - Invalid Format")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testParticipate_InvalidFormat() throws Exception {
		mockMvc.perform(post("/api/session/{sessionId}/participate/{userId}", "sessionId", "userId"))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Successful cancel participation in session")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testNoParticipate_Success() throws Exception {

		Long sessionId = sessionOne.getId();
		Long userId = user.getId();

		mockMvc.perform(post("/api/session/{sessionId}/participate/{userId}", sessionId, userId))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/session/{sessionId}", sessionId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users").isArray())
				.andExpect(jsonPath("$.users.length()").value(1))
				.andExpect(jsonPath("$.users[0]").value(userId));

		mockMvc.perform(delete("/api/session/{sessionId}/participate/{userId}", sessionId, userId))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/session/{sessionId}", sessionId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.users").isArray())
				.andExpect(jsonPath("$.users").isEmpty());
	}
}
