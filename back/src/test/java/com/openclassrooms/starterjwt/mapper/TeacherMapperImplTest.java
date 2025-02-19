package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
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
 * Classe de test unitaire pour {@link TeacherMapper}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Conversion d'un TeacherDto en Teacher</li>
 *         <li>Conversion d'un Teacher en TeacherDto</li>
 *         <li>Conversion d'une liste de TeacherDto en liste de Teacher</li>
 *         <li>Conversion d'une liste de Teacher en liste de TeacherDto</li>
 *     </ul>
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class TeacherMapperImplTest {

	private TeacherMapper teacherMapper;

	private Teacher teacher;
	private TeacherDto teacherDto;


	@BeforeEach
	void setUp() {
		teacherMapper = Mappers.getMapper(TeacherMapper.class);

		teacher = Teacher.builder()
				.id(1L)
				.firstName("Albus")
				.lastName("Dumbledore")
				.build();

		teacherDto = new TeacherDto();
		teacherDto.setId(1L);
		teacherDto.setFirstName("Albus");
		teacherDto.setLastName("Dumbledore");
	}

	@Test
	@DisplayName("Should correctly map TeacherDto to Teacher")
	void testToEntity() {
		// WHEN
		Teacher mappedTeacher = teacherMapper.toEntity(teacherDto);

		// THEN
		assertNotNull(mappedTeacher);
		assertEquals(teacherDto.getId(), mappedTeacher.getId());
		assertEquals(teacherDto.getFirstName(), mappedTeacher.getFirstName());
		assertEquals(teacherDto.getLastName(), mappedTeacher.getLastName());
	}

	@Test
	@DisplayName("Should correctly map Teacher to TeacherDto")
	void testToDto() {
		// WHEN
		TeacherDto mappedDto = teacherMapper.toDto(teacher);

		// THEN
		assertNotNull(mappedDto);
		assertEquals(teacher.getId(), mappedDto.getId());
		assertEquals(teacher.getFirstName(), mappedDto.getFirstName());
		assertEquals(teacher.getLastName(), mappedDto.getLastName());
	}

	@Test
	@DisplayName("Should correctly map a list of TeacherDto to a list of Teacher")
	void testToEntityList() {
		// GIVEN
		List<TeacherDto> dtoList = Collections.singletonList(teacherDto);

		// WHEN
		List<Teacher> teacherList = teacherMapper.toEntity(dtoList);

		// THEN
		assertNotNull(teacherList);
		assertEquals(1, teacherList.size());
		assertEquals(teacherDto.getId(), teacherList.get(0).getId());
	}

	@Test
	@DisplayName("Should correctly map a list of Teacher to a list of TeacherDto")
	void testToDtoList() {
		// GIVEN
		List<Teacher> teacherList = Collections.singletonList(teacher);

		// WHEN
		List<TeacherDto> dtoList = teacherMapper.toDto(teacherList);

		// THEN
		assertNotNull(dtoList);
		assertEquals(1, dtoList.size());
		assertEquals(teacher.getId(), dtoList.get(0).getId());
	}

}