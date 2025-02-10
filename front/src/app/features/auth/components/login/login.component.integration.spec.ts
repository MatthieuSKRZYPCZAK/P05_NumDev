import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import {mockSessionInformation} from "../../../../mocks/mock-data";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";

describe('LoginComponent - Integration Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        LoginComponent,
        FormBuilder,
        AuthService,
        SessionService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  /**
   * Test 1 : Vérifie que l'utilisateur est authentifié et redirigé après une connexion réussie.
   */
  it('should authenticate and redirect user on valid login', () => {
    jest.spyOn(authService, 'login').mockReturnValue(of(mockSessionInformation)); // Simule une réponse valide
    jest.spyOn(sessionService, 'logIn'); // Vérifie si `logIn` est appelé
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true)); // Vérifie la navigation

    // Remplit le formulaire avec des données valides
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    // Soumet le formulaire
    component.submit();

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
    expect(sessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });
});
