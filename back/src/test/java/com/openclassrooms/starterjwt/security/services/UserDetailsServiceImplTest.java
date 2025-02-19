package com.openclassrooms.starterjwt.security.services;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

/**
 *  Classe de test unitaire pour {@link UserDetailsServiceImpl}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Chargement d'un utilisateur existant par son adresse e-mail</li>
 *         <li>Gestion de l'exception lorsque l'utilisateur n'est pas trouvé</li>
 *     </ul>
 *</p>
 */
@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserDetailsServiceImpl userDetailsService;

	private User user;

	@BeforeEach
	void setUp() {
		user = new User();
		user.setId(1L);
		user.setEmail("john.doe@example.com");
		user.setLastName("Doe");
		user.setFirstName("John");
		user.setPassword("password");
	}

	@Test
	@DisplayName("Load user by username successfully")
	void testLoadUserByUsername_success() {
		when(userRepository.findByEmail("john.doe@example.com")).thenReturn(Optional.of(user));

		UserDetails userDetails = userDetailsService.loadUserByUsername("john.doe@example.com");

		assertNotNull(userDetails);
		assertEquals("john.doe@example.com", userDetails.getUsername());
		assertEquals("password", userDetails.getPassword());
		assertEquals("John", ((UserDetailsImpl) userDetails).getFirstName());
		assertEquals("Doe", ((UserDetailsImpl) userDetails).getLastName());
	}

	@Test
	@DisplayName("Throw exception when user not found")
	void testLoadUserByUsername_userNotFound() {
		when(userRepository.findByEmail("jane.doe@example.com")).thenReturn(Optional.empty());

		UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () -> {
			userDetailsService.loadUserByUsername("jane.doe@example.com");
		});

		assertTrue(exception.getMessage().contains("User Not Found with email: jane.doe@example.com"));
	}

}