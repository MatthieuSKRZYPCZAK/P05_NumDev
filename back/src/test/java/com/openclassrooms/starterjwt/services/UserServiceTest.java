package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Classe de test unitaire pour {@link UserService}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Suppression d'un utilisateur</li>
 *         <li>Récupération d'un utilisateur par son ID - succès</li>
 *         <li>Récupération d'un utilisateur par son ID - échec (non trouvé)</li>
 *     </ul>
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserService userService;

	private User user;

	@BeforeEach
	void setUp() {
		user = User.builder()
				.id(1L)
				.firstName("John")
				.lastName("Doe")
				.password("password")
				.email("john.doe@example.com")
				.build();

	}

	@Test
	@DisplayName("Should delete a user by ID")
	void testDelete() {
		// WHEN
		userService.delete(user.getId());

		// THEN
		verify(userRepository, times(1)).deleteById(user.getId());
	}

	@Test
	@DisplayName("Should return a user when ID exists")
	void testFindById_Success() {
		// GIVEN
		when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

		// WHEN
		User actualUser = userService.findById(user.getId());

		// THEN
		assertNotNull(actualUser);
		assertEquals(user, actualUser);
		verify(userRepository, times(1)).findById(user.getId());
	}

	@Test
	@DisplayName("Should return null when user ID does not exist")
	void testFindById_NotFound() {
		// GIVEN
		when(userRepository.findById(user.getId())).thenReturn(Optional.empty());

		// WHEN
		User actualUser = userService.findById(user.getId());

		// THEN
		assertNull(actualUser);
		verify(userRepository, times(1)).findById(user.getId());
	}

}