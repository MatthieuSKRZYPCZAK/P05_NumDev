package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Classe de test unitaire pour {@link UserDetailsImpl}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Vérification des autorités d'un utilisateur</li>
 *         <li>Comparaison d'un même objet</li>
 *         <li>Comparaison de deux objets ayant le même ID</li>
 *         <li>Comparaison de deux objets ayant un ID différent</li>
 *         <li>Comparaison d'un objet avec {@code null}</li>
 *     </ul>
 * </p>
 */
class UserDetailsImplTest {


	UserDetailsImpl adminUser = UserDetailsImpl.builder()
			.id(1L)
			.username("jane.doe@example.com")
			.firstName("Jane")
			.lastName("Doe")
			.password("password")
			.admin(true)
			.build();

	UserDetailsImpl userOne = UserDetailsImpl.builder()
			.id(1L)
			.username("john.doe@example.com")
			.firstName("John")
			.lastName("Doe")
			.password("password")
			.admin(false)
			.build();

	UserDetailsImpl userTwo = UserDetailsImpl.builder()
			.id(2L)
			.username("albus.dumbledore@example.com")
			.firstName("Albus")
			.lastName("Dumbledore")
			.password("password")
			.admin(false)
			.build();


	@Test
	@DisplayName("User should have no authorities")
	void testAuthorities() {
		assert (userOne.getAuthorities()).isEmpty();
	}

	@Test
	@DisplayName("Equals should return true when comparing the same object")
	void testEquals_SameObject() {
		assertEquals(userOne, userOne);
	}

	@Test
	@DisplayName("Equals should return true for two objects with the same ID")
	void testEquals_SameId() {
		assertEquals(adminUser, userOne);
	}

	@Test
	@DisplayName("Equals should return false for two objects with different IDs")
	void testEquals_DifferentId() {
		assertNotEquals(adminUser, userTwo);
	}

	@Test
	@DisplayName("Equals should return false when comparing with null")
	void testEquals_Null() {
		assertNotEquals(null, userOne);
	}

	@Test
	@DisplayName("Equals should return false when comparing with an object of another class")
	void testEquals_DifferentClass() {
		String differentObject = "not a UserDetailsImpl";
		assertNotEquals(differentObject, userOne);
	}


}