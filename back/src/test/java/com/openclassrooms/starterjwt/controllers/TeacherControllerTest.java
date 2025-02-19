package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 *  Classe de test d'intégration pour le contrôleur {@link TeacherController}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Récupération d'un enseignant par son ID - succès</li>
 *         <li>Récupération d'un enseignant par son ID - échec (non trouvée)</li>
 *         <li>Récupétation de tous les enseignants - succès</li>
 *     </ul>
 *</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TeacherControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private TeacherRepository teacherRepository;

	private final Teacher teacherOne = Teacher.builder()
			.firstName("Albus")
			.lastName("Dumbledore")
			.createdAt(LocalDateTime.now())
			.build();

	private final Teacher teacherTwo = Teacher.builder()
			.firstName("Minerva")
			.lastName("McGonagall")
			.createdAt(LocalDateTime.now())
			.build();

	@BeforeEach
	void setUp() {
		teacherRepository.deleteAll();

		Teacher savedTeacherOne = teacherRepository.save(teacherOne);
		teacherOne.setId(savedTeacherOne.getId());

		Teacher savedTeacherTwo = teacherRepository.save(teacherTwo);
		teacherTwo.setId(savedTeacherTwo.getId());
	}

	@AfterEach
	void cleanUp() {
		teacherRepository.deleteAll();
	}

	@Test
	@DisplayName("Successful find teacher by ID")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindById_Success() throws Exception {
		Long id = teacherOne.getId();

		mockMvc.perform(get("/api/teacher/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(teacherOne.getId()))
				.andExpect(jsonPath("$.firstName").value(teacherOne.getFirstName()))
				.andExpect(jsonPath("$.lastName").value(teacherOne.getLastName()));
	}

	@Test
	@DisplayName("Fail to find teacher by ID")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindById_NotFound() throws Exception {
		Long id = 101L;

		mockMvc.perform(get("/api/teacher/{id}", id))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Successful find all teachers")
	@WithMockUser // Sumulation d'un utilisateur authentifié
	void testFindAll_Success() throws Exception {
		mockMvc.perform(get("/api/teacher"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(2))
				.andExpect(jsonPath("$[0].firstName").value(teacherOne.getFirstName()))
				.andExpect(jsonPath("$[1].firstName").value(teacherTwo.getFirstName()));
	}
}
