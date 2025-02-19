package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Classe de test unitaire pour {@link TeacherService}.
 * <p>
 *     Scénarios testés :
 *     <ul>
 *         <li>Récupération de tous les enseignants</li>
 *         <li>Récupération d'un enseignant par son ID - succès</li>
 *         <li>Récupération d'un enseignant par son ID - échec (non trouvé)</li>
 *     </ul>
 * </p>
 */
@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

	@Mock
	private TeacherRepository teacherRepository;

	@InjectMocks
	private TeacherService teacherService;

	private Teacher teacherOne;
	private Teacher teacherTwo;

	@BeforeEach
	void setUp() {
		teacherOne = Teacher.builder()
				.id(1L)
				.firstName("Albus")
				.lastName("Dumbledore")
				.build();

		teacherTwo = Teacher.builder()
				.id(2L)
				.firstName("Minerva")
				.lastName("McGonagall")
				.build();
	}


	@Test
	@DisplayName("Should return all teachers")
	void testFindAll() {
		// GIVEN
		List<Teacher> expectedTeachers = Arrays.asList(teacherOne, teacherTwo);
		when(teacherRepository.findAll()).thenReturn(expectedTeachers);

		// WHEN
		List<Teacher> actualTeachers = teacherService.findAll();

		// THEN
		assertNotNull(actualTeachers);
		assertEquals(2, actualTeachers.size());
		assertEquals(expectedTeachers, actualTeachers);
		verify(teacherRepository, times(1)).findAll();
	}

	@Test
	@DisplayName("Should return a teacher when ID exists")
	void testFindById_Success() {
		// GIVEN
		Long teacherId = 1L;
		when(teacherRepository.findById(teacherId)).thenReturn(Optional.of(teacherOne));

		// WHEN
		Teacher actualTeacher = teacherService.findById(teacherId);

		// THEN
		assertNotNull(actualTeacher);
		assertEquals(teacherOne, actualTeacher);
		verify(teacherRepository, times(1)).findById(teacherId);
	}

	@Test
	@DisplayName("Should return null when teacher ID does not exist")
	void testFindById_NotFound() {
		// GIVEN
		Long teacherId = 101L;
		when(teacherRepository.findById(teacherId)).thenReturn(Optional.empty());

		// WHEN
		Teacher actualTeacher = teacherService.findById(teacherId);

		// THEN
		assertNull(actualTeacher);
		verify(teacherRepository, times(1)).findById(teacherId);
	}

}