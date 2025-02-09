import { HttpClientModule } from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import {SessionService} from "./services/session.service";
import {Router} from "@angular/router";
import {of} from "rxjs";


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // Mocks des services
  let sessionServiceMock: { logOut: jest.Mock; $isLogged: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {

    sessionServiceMock = {
      logOut: jest.fn(),
      $isLogged: jest.fn().mockReturnValue(of(true))
    };

    routerMock = {
      navigate: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

  });

  /**
   * Test 1 : Vérification de la création du composant
   */
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test 2 : Récupération du statut de connexion
   */
  it('should return the expected login status', () => {
    component.$isLogged().subscribe(status => {
      expect(status).toBe(true);
    });

    expect(sessionServiceMock.$isLogged).toHaveBeenCalled();
  });

  /**
   * Test 3 : Déconnexion de l'utilisateur et navigue vers la route racine ('')
   */
  it('should log out the user and navigate to the root', () => {
    component.logout();
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });


});
