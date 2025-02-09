import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Session} from "../interfaces/session.interface";
import {mockSession} from "../../../mocks/mock-data";

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [
        SessionApiService
      ]
    });
    // Injection du service AuthService et du contrôleur de test pour gérer les requêtes HTTP fictives
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(SessionApiService);
  });

  // Vérification qu'aucune requête HTTP non traitée ne persiste après chaque test
  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Test 1: Vérification de la création du composant
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test 2: Récupération de toutes les sessions
   */
  it('should get all sessions', done => {
    service.all().subscribe((sessions) => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSession);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: 'api/session'
    });

    req.flush(mockSession);
  })

  /**
   * Test 3: Récupération des détails d'une session spécifique
   */
  it('should get a session detail', done => {

    service.detail('1').subscribe(session => {
      expect(session).toEqual(mockSession[0]);
      done();
    });

    const req = httpMock.expectOne({
      method: 'GET',
      url: 'api/session/1'
    });

    req.flush(mockSession[0]);
  });

  /**
   * Test 4: Suppression d'une session
   */
  it('should delete a session', done => {
    service.delete('1').subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: 'api/session/1'
    });
    req.flush({});
  });

  /**
   * Test 5: Création d'une nouvelle session
   */
  it('should create a session', done => {
    const newSession = { ...mockSession[1], id: 5, users: [] }
    service.create(newSession).subscribe({
      complete: () => done()
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: 'api/session'
    });

    expect(req.request.body).toEqual(newSession);
    req.flush(newSession);
  });

  /**
   * Test 6: Mise à jour d'une session existante
   */
  it('should update a session', done => {
    const updateSession: Session = {
      ...mockSession[0],
      description: "Updated description"
    };

    service.update('1', updateSession).subscribe(session => {
      expect(session).toEqual(updateSession);
      done();
    })

    const req = httpMock.expectOne({
      method: 'PUT',
      url: 'api/session/1'
    });

    expect(req.request.body).toEqual(updateSession);
    req.flush(updateSession);
  });

  /**
   * Test 8: Inscription d'un utilisateur à une session
   */
  it('should allow a user to participate in a session', done => {
    service.participate('1', '2').subscribe( {
      complete: () => done()
    });

    const req = httpMock.expectOne({
      method: 'POST',
      url: `api/session/1/participate/2`
    });

    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  /**
   * Test 9: Désinscription d'un utilisateur d'une session
   */
  it('should allow a user to unparticipate from a session', done => {
    service.unParticipate('1', '2').subscribe({
      complete: () => done()
    });

    const req = httpMock.expectOne({
      method: 'DELETE',
      url: `api/session/1/participate/2`
    });
    req.flush(null);
  });

});
