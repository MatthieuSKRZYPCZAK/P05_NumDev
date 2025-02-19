package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Classe de test unitaire pour {@link SessionMapper}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Conversion d'un SessionDto en Session</li>
 *         <li>Conversion d'un Session en SessionDto</li>
 *         <li>Gestion des cas avec null et listes vides</li>
 *     </ul>
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SessionMapperTest {

	@InjectMocks
	private SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

	@Mock
	private TeacherService teacherService;

	@Mock
	private UserService userService;

	private SessionDto sessionDto;
	private Session session;
	private Teacher teacher;
	private User userOne;
	private User userTwo;

	@BeforeEach
	void setUp() {
		teacher = Teacher.builder()
				.id(1L)
				.firstName("Albus")
				.lastName("Dumbledore")
				.build();

		userOne = User.builder()
				.id(1L)
				.firstName("John")
				.lastName("Doe")
				.password("password")
				.email("john.doe@example.com")
				.build();

		userTwo = User.builder()
				.id(2L)
				.firstName("Jane")
				.lastName("Doe")
				.password("password")
				.email("jane.doe@example.com")
				.build();


		List<Long> userIds = Arrays.asList(userOne.getId(), userTwo.getId());
		List<User> users = Arrays.asList(userOne, userTwo);

		sessionDto = new SessionDto();
		sessionDto.setDescription("Session Test");
		sessionDto.setTeacher_id(1L);
		sessionDto.setUsers(userIds);

		session = new Session();
		session.setDescription("Session Test");
		session.setTeacher(teacher);
		session.setUsers(users);
	}

	@Test // Vérifie que la conversion d'un SessionDto en Session fonctionne correctement.
	@DisplayName("Should correctly map SessionDto to Session")
	void testToEntity() {
		// GIVEN
		when(teacherService.findById(1L)).thenReturn(teacher);
		when(userService.findById(1L)).thenReturn(userOne);
		when(userService.findById(2L)).thenReturn(userTwo);

		// WHEN
		Session mappedSession = sessionMapper.toEntity(sessionDto);

		// THEN
		assertNotNull(mappedSession);
		assertEquals("Session Test", mappedSession.getDescription());
		assertEquals(teacher, mappedSession.getTeacher());
		assertEquals(2, mappedSession.getUsers().size());
		assertTrue(mappedSession.getUsers().contains(userOne));
		assertTrue(mappedSession.getUsers().contains(userTwo));

		// Vérifier que les services mockés ont bien été appelés
		verify(teacherService, times(1)).findById(1L);
		verify(userService, times(1)).findById(1L);
		verify(userService, times(1)).findById(2L);
	}

	@Test // Vérifie que la conversion d'une Session en SessionDto fonctionne correctement.
	@DisplayName("Should correctly map Session to SessionDto")
	void testToDto() {
		// WHEN
		SessionDto mappedDto = sessionMapper.toDto(session);

		// THEN
		assertNotNull(mappedDto);
		assertEquals("Session Test", mappedDto.getDescription());
		assertEquals(1L, mappedDto.getTeacher_id());
		assertEquals(2, mappedDto.getUsers().size());
		assertTrue(mappedDto.getUsers().contains(1L));
		assertTrue(mappedDto.getUsers().contains(2L));
	}

	@Test // Vérifie que la conversion d'une SessionDto en Session gère les cas où teacher_id est null.
	@DisplayName("Should correctly handle null teacher_id in SessionDto")
	void testToEntity_NullTeacher() {
		// GIVEN
		sessionDto.setTeacher_id(null);

		// WHEN
		Session mappedSession = sessionMapper.toEntity(sessionDto);

		// THEN
		assertNotNull(mappedSession);
		assertNull(mappedSession.getTeacher());
	}

	@Test // Vérifie que la conversion d'une SessionDto en Session gère les cas où la liste des utilisateurs est vide.
	@DisplayName("Should correctly handle empty user list in SessionDto")
	void testToEntity_EmptyUsers() {
		// GIVEN
		sessionDto.setUsers(Collections.emptyList());

		// WHEN
		Session mappedSession = sessionMapper.toEntity(sessionDto);

		// THEN
		assertNotNull(mappedSession);
		assertNotNull(mappedSession.getUsers());
		assertTrue(mappedSession.getUsers().isEmpty());
	}

	@Test // Vérifie que la conversion d'une SessionDto en Session gère les cas où la liste des utilisateurs est null.
	@DisplayName("Should correctly handle null user list in SessionDto")
	void testToEntity_NullUsers() {
		// GIVEN
		sessionDto.setUsers(null);

		// WHEN
		Session mappedSession = sessionMapper.toEntity(sessionDto);

		// THEN
		assertNotNull(mappedSession);
		assertNotNull(mappedSession.getUsers());
		assertTrue(mappedSession.getUsers().isEmpty());
	}

	@Test
	@DisplayName("Should correctly map a list of SessionDto to a list of Session")
	void testToEntity_List() {
		// GIVEN - Une liste de SessionDto
		List<SessionDto> dtoList = Arrays.asList(sessionDto, sessionDto);

		when(teacherService.findById(1L)).thenReturn(teacher);
		when(userService.findById(1L)).thenReturn(userOne);
		when(userService.findById(2L)).thenReturn(userTwo);

		// WHEN - Conversion en liste de Session
		List<Session> sessions = sessionMapper.toEntity(dtoList);

		// THEN
		assertNotNull(sessions);
		assertEquals(2, sessions.size());
		assertEquals("Session Test", sessions.get(0).getDescription());
		assertEquals("Session Test", sessions.get(1).getDescription());
	}

	@Test
	@DisplayName("Should return null for teacher_id when session has no teacher")
	void testToDto_NullTeacher() {
		// GIVEN
		session.setTeacher(null);

		// WHEN
		SessionDto mappedDto = sessionMapper.toDto(session);

		// THEN
		assertNotNull(mappedDto);
		assertNull(mappedDto.getTeacher_id()); // Vérifie que teacher_id est bien null
	}

	@Test
	@DisplayName("Should return null when converting null SessionDto list to entity list")
	void testToEntity_NullList() {
		// WHEN
		List<Session> sessions = sessionMapper.toEntity((List<SessionDto>) null);

		// THEN
		assertNull(sessions);
	}


	@Test
	@DisplayName("Should return null when converting null Session list to DTO list")
	void testToDto_NullList() {
		// WHEN
		List<SessionDto> sessionDtos = sessionMapper.toDto((List<Session>) null);

		// THEN
		assertNull(sessionDtos);
	}

	@Test
	@DisplayName("Should return null when converting null SessionDto to entity")
	void testToEntity_NullSessionDto() {
		// WHEN
		Session session = sessionMapper.toEntity((SessionDto) null);

		// THEN
		assertNull(session);
	}

	@Test
	@DisplayName("Should return null when converting null Session to DTO")
	void testToDto_NullSession() {
		// WHEN
		SessionDto sessionDto = sessionMapper.toDto((Session) null);

		// THEN
		assertNull(sessionDto);
	}




}