import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import {RegisterRequest} from "../interfaces/registerRequest.interface";
import {LoginRequest} from "../interfaces/loginRequest.interface";
import {SessionInformation} from "../../../interfaces/sessionInformation.interface";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Initialisation des données pour une requête d'inscription
  const registerRequest: RegisterRequest = {
    email: 'newUser@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password:'password12345'
  };

  // Initialisation des données pour une requête de connexion
  const loginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'password12345'
  };

  // Initialisation des données pour la réponse de session après connexion
  const mockSessionInformation: SessionInformation = {
    token: 'fake-token',
    type: 'mockType',
    id: 777,
    username: 'JohnDoe',
    firstName: 'John',
    lastName: 'Doe',
    admin: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    // Injection du service AuthService et du contrôleur de test pour gérer les requêtes HTTP fictives
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Vérification qu'aucune requête HTTP non traitée ne persiste après chaque test
  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Test 1: Vérification de l'inscription d'un utilisateur
   * Simulation d'une inscription et vérifie que la requête envoyée correspond aux attentes.
   */
  it('should allow user to register', done => {

    // Appel de la méthode register() avec les données d'inscription
    service.register(registerRequest).subscribe({
      complete: () => done()
    });

    // Vérification que la requête envoyée est bien une requête POST vers l'URL d'inscription
    const req = httpMock.expectOne({
      method: 'POST',
      url: 'api/auth/register'
    });

    // Vérification que le corps de la requête envoyée correspond bien aux données attendues
    expect(req.request.body).toEqual(registerRequest);

    // Simulation d'une réponse vide du serveur (l'inscription ne renvoie pas de données)
    req.flush({});
  });

  /**
   * Test 2: Vérification de la connexion d'un utilisateur
   * Simule une connexion et vérifie que les données renvoyées par le serveur sont correctes.
   */
  it('should allow user to login', done => {

    // Appel de la méthode login() avec les données de connexion
    service.login(loginRequest).subscribe(response => {
      // Vérification que la réponse obtenue est bien celle attendue
      expect(response).toEqual(mockSessionInformation);
      done(); // On signale que le test est terminé après la réponse
    });

    // Vérification que la requête envoyée est bien une requête POST vers l'URL de connexion
    const req = httpMock.expectOne({
      method: 'POST',
      url: 'api/auth/login'
    });

    // Vérification que le corps de la requête envoyée correspond bien aux données attendues
    expect(req.request.body).toEqual(loginRequest);

    // Simule une réponse du serveur avec les informations fictives
    req.flush(mockSessionInformation);
  });
});
