package com.openclassrooms.starterjwt.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 *  Classe de test unitaire pour {@link JwtUtils}.
 *<p>
 *     Scénarios testés:
 *     <ul>
 *         <li>Extraction du nom d'utilisateur depuis un token valide</li>
 *         <li>Validation d'un token valide</li>
 *         <li>Rejet d'un token expiré</li>
 *         <li>Rejet d'un token invalide</li>
 *     </ul>
 *</p>
 */
class JwtUtilsTest {


	private JwtUtils jwtUtils;
	private String validToken;
	private String expiredToken;

	@BeforeEach
	void setUp() {
		String secret = "openclassrooms";
		jwtUtils = new JwtUtils();
		ReflectionTestUtils.setField(jwtUtils, "jwtSecret", secret);

		validToken = Jwts.builder()
				.setSubject("yoga@studio.com")
				.setIssuedAt(Date.from(Instant.now()))
				.setExpiration(Date.from(Instant.now().plusSeconds(1800L)))
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();

		expiredToken = Jwts.builder()
				.setSubject("yoga@studio.com")
				.setIssuedAt(Date.from(Instant.now().minusSeconds(3600L)))
				.setExpiration(Date.from(Instant.now().minusSeconds(1800L)))
				.signWith(SignatureAlgorithm.HS512, secret)
				.compact();
	}

	@Test
	@DisplayName("Extract username from a valid JWT token")
	void testGetUserNameFromJwtToken() {
		String username = jwtUtils.getUserNameFromJwtToken(validToken);
		assertEquals("yoga@studio.com", username);
	}

	@Test
	@DisplayName("Validate a valid JWT token")
	void testValidateJwtToken_validToken() {
		assertTrue(jwtUtils.validateJwtToken(validToken));
	}

	@Test
	@DisplayName("Reject an expired JWT token")
	void testValidateJwtToken_expiredToken() {
		assertFalse(jwtUtils.validateJwtToken(expiredToken));
	}

	@Test
	@DisplayName("Reject an invalid JWT token")
	void testValidateJwtToken_invalidToken() {
		String invalidToken = "invalid-token";
		assertFalse(jwtUtils.validateJwtToken(invalidToken));
	}
}