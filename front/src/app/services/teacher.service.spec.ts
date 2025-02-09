import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';

import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {mockTeachers} from "../mocks/mock-data";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers:[
        TeacherService
      ]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Test 1: Vérification de la création du service.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test 2: Vérifie que le service récupère la liste des enseignants.
   */
  it('should fetch all teachers', done => {
    service.all().subscribe((teachers)=> {
      expect(teachers.length).toBe(2);
      expect(teachers).toEqual(mockTeachers);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: 'api/teacher'
    });
    req.flush(mockTeachers);
  });

  /**
   * Test 3: Vérifie que le service récupère un enseignant par son ID.
   */
  it('should fetch a teacher by ID', done => {
    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeachers[0]);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: 'api/teacher/1'
    });
    req.flush(mockTeachers[0]);

  });
});
