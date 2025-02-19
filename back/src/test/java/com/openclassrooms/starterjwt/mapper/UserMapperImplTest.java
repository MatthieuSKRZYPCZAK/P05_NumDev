package com.openclassrooms.starterjwt.mapper;


import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Classe de test unitaire pour {@link UserMapper}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Conversion d'un UserDto en User</li>
 *         <li>Conversion d'un User en UserDto</li>
 *         <li>Conversion d'une liste de UserDto en liste de User</li>
 *         <li>Conversion d'une liste de User en liste de UserDto</li>
 *     </ul>
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class UserMapperImplTest {

	private UserMapper userMapper;

	private User user;
	private UserDto userDto;

	@BeforeEach
	void setUp() {
		userMapper = Mappers.getMapper(UserMapper.class);

		user = User.builder()
				.id(1L)
				.firstName("John")
				.lastName("Doe")
				.password("password")
				.email("john.doe@example.com")
				.build();

		userDto = new UserDto();
		userDto.setId(1L);
		userDto.setFirstName("John");
		userDto.setLastName("Doe");
		userDto.setPassword("password");
		userDto.setEmail("john.doe@example.com");
	}

	@Test
	@DisplayName("Should correctly map UserDto to User")
	void testToEntity() {
		// WHEN
		User mappedUser = userMapper.toEntity(userDto);

		// THEN
		assertNotNull(mappedUser);
		assertEquals(userDto.getId(), mappedUser.getId());
		assertEquals(userDto.getFirstName(), mappedUser.getFirstName());
		assertEquals(userDto.getLastName(), mappedUser.getLastName());
		assertEquals(userDto.getEmail(), mappedUser.getEmail());
		assertEquals(userDto.getPassword(), mappedUser.getPassword());
	}

	@Test
	@DisplayName("Should correctly map User to UserDto")
	void testToDto() {
		// WHEN
		UserDto mappedDto = userMapper.toDto(user);

		// THEN
		assertNotNull(mappedDto);
		assertEquals(user.getId(), mappedDto.getId());
		assertEquals(user.getFirstName(), mappedDto.getFirstName());
		assertEquals(user.getLastName(), mappedDto.getLastName());
		assertEquals(user.getEmail(), mappedDto.getEmail());
		assertEquals(user.getPassword(), mappedDto.getPassword());
	}

	@Test
	@DisplayName("Should correctly map a list of UserDto to a list of User")
	void testToEntityList() {
		// GIVEN
		List<UserDto> dtoList = Collections.singletonList(userDto);

		// WHEN
		List<User> userList = userMapper.toEntity(dtoList);

		// THEN
		assertNotNull(userList);
		assertEquals(1, userList.size());
		assertEquals(userDto.getId(), userList.get(0).getId());
	}

	@Test
	@DisplayName("Should correctly map a list of User to a list of UserDto")
	void testToDtoList() {
		// GIVEN
		List<User> userList = Collections.singletonList(user);

		// WHEN
		List<UserDto> dtoList = userMapper.toDto(userList);

		// THEN
		assertNotNull(dtoList);
		assertEquals(1, dtoList.size());
		assertEquals(user.getId(), dtoList.get(0).getId());
	}

}