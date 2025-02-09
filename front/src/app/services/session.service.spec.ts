import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import {SessionInformation} from "../interfaces/sessionInformation.interface";

describe('SessionService', () => {
  let service: SessionService;

  const mockSession: SessionInformation = {
    token: 'fake-token',
    type: 'Bearer',
    id: 1,
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  /**
   * Test 1: Vérification de la création du service.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test 2: Vérification de l'état de connexion initial.
   */
  it('should have initial logged out state', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  })

  /**
   * Test 3: Vérification du processus de connexion.
   */
  it('should log in a user', () => {
    service.logIn(mockSession);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSession);
  })

  /**
   * Test 4: Vérification du processus de déconnexion.
   */
  it('should log out a user', () => {
    service.logIn(mockSession);
    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  /**
   * Test 5: Vérification de l'émission de l'état de connexion via l'Observable.
   */
  it('should emit login state changes', done => {
    service.$isLogged().subscribe((loggedIn) => {
      expect(loggedIn).toBe(true);
      done();
    });
    service.logIn(mockSession);
  });

  /**
   * Test 6: Vérification de l'émission de l'état de déconnexion via l'Observable.
   */
  it('should emit logout state changes', done => {
    service.logIn(mockSession);
    service.$isLogged().subscribe((loggedIn) => {
      expect(loggedIn).toBe(false);
      done();
    });
    service.logOut();
  });
});
