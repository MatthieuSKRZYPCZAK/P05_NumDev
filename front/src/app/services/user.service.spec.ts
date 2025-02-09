import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {mockUser} from "../mocks/mock-data";


describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers:[
        UserService
      ]
    });
    service = TestBed.inject(UserService);
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
   * Test 2: Vérifie que le service récupère un utilisateur par ID.
   */
  it('should fetch a user by ID', done => {
    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: 'api/user/1'
    });
    expect(req.request.url).toBe('api/user/1');
    req.flush(mockUser);
  });

  /**
   * Test 3: Vérifie que le service supprime un utilisateur.
   */
  it('should delete a user', done => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: 'api/user/1'
    });

    expect(req.request.url).toBe('api/user/1');
    req.flush({});
  });
});
