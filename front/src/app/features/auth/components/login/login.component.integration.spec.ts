import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import {of, throwError } from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";


describe('LoginComponent - Integration Tests',
  () => {
    // Déclaration des variables pour le composant, les mocks et le fixture.
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceMock: Partial<AuthService>;
    let routerMock: Partial<Router>;
    let sessionServiceMock: Partial<SessionService>;

    beforeEach(async () => {
      // Mocks les services
      authServiceMock = {
        login: jest.fn()
      };

      sessionServiceMock = {
        logIn: jest.fn()
      };

      routerMock = {
        navigate: jest.fn()
      };

      // Configuration du module de test
      await TestBed.configureTestingModule({
        declarations: [LoginComponent],
        providers: [
          {provide: AuthService, useValue: authServiceMock},
          {provide: SessionService, useValue: sessionServiceMock},
          {provide: Router, useValue: routerMock}
        ],
        imports: [
          BrowserAnimationsModule,
          HttpClientModule,
          MatCardModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          ReactiveFormsModule]
      })
        .compileComponents();
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    /**
     * Test 1 : Navigation après un login réussi
     * - Vérifie qu'un login réussi redirige vers la page "/sessions".
     */
    it('should navigate to /sessions on successful login', () => {
      const fakeResponse = {token: 'fake-token '};

      // Mock du service login
      authServiceMock.login = jest.fn().mockReturnValue(of(fakeResponse));

      // Formulaire avec des valeurs valides
      component.form.setValue({
        email: 'test@example.com',
        password: 'password12345'
      });

      component.submit();

      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password12345'
      });

      expect(sessionServiceMock.logIn).toHaveBeenCalledWith(fakeResponse);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    /**
     * Test 2 : Gestion des erreurs d'authentification
     * - Vérifie qu'un message d'erreur est affiché lorsque l'authentification échoue.
     */
    it('should display an error message if authentication fails', () => {
      authServiceMock.login = jest.fn().mockReturnValue(throwError(() => new Error('Authentication error')));
      component.form.setValue({
        email: 'invalid@example.com',
        password: 'invalidpassword'
      });

      component.submit();

      expect(authServiceMock.login).toHaveBeenCalledWith({
        email: 'invalid@example.com',
        password: 'invalidpassword'
      });


      expect(component.onError).toBe(true);

      fixture.detectChanges();
      const errorElement = fixture.nativeElement.querySelector('.error');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('An error occurred');
    });

  });
