package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Classe de test unitaire pour {@link SessionService}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Ajout réussi d'un utilisateur à une session</li>
 *         <li>Échec lorsque la session n'existe pas</li>
 *         <li>Échec lorsque l'utilisateur n'existe pas</li>
 *         <li>Échec lorsque l'utilisateur est déjà inscrit à la session</li>
 *     </ul>
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

	@Mock
	private SessionRepository sessionRepository;

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private SessionService sessionService;

	private Long sessionId;
	private Long userId;
	private Session session;
	private User user;

	@BeforeEach
	void setUp() {
		sessionId = 1L;
		userId = 1L;

		session = new Session();
		session.setId(sessionId);
		session.setUsers(new ArrayList<>());

		user = new User();
		user.setId(userId);
	}

	@AfterEach
	void cleanUp() {
		session.setUsers(new ArrayList<>());
	}

	@Test
	@DisplayName("Should successfully add user to session")
	void testParticipate_Success(){

		when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
		when(userRepository.findById(userId)).thenReturn(Optional.of(user));
		when(sessionRepository.save(any(Session.class))).thenReturn(session);

		assertDoesNotThrow(() -> sessionService.participate(sessionId, userId));

		// THEN
		assertTrue(session.getUsers().contains(user));
		verify(sessionRepository, times(1)).save(session);

	}

	@Test
	@DisplayName("Should throw NotFoundException when session does not exist")
	void testParticipate_SessionNotFound() {

		when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

		assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
	}

	@Test
	@DisplayName("Should throw NotFoundException when user does not exist")
	void testParticipate_UserNotFound() {

		when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
		when(userRepository.findById(userId)).thenReturn(Optional.empty());

		assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
	}

	@Test
	@DisplayName("Should throw BadRequestException when user already participates in the session")
	void testParticipate_UserAlreadyParticipates() {

		session.getUsers().add(user);

		when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
		when(userRepository.findById(userId)).thenReturn(Optional.of(user));

		assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
	}

}