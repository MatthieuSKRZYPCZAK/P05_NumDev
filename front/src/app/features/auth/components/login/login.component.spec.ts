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
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";


describe('LoginComponent', () => {
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
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
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
   * Test 1 : Vérification de la création du composant
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test 2 : Vérification de la visibilité du mot de passe
   * - Vérifie que le champ mot de passe bascule entre 'password' et 'text'
   */
  it('should toggle password visibility', () => {
    const passwordField = fixture.nativeElement.querySelector('input[formControlName="password"]');
    const visibilityButton = fixture.nativeElement.querySelector('button[matSuffix]');

    // Par défaut, le champ doit être masqué
    expect(passwordField.type).toBe('password');

    // Cliquer sur le bouton pour afficher le mot de passe
    visibilityButton.click();
    fixture.detectChanges();

    // Après le clic, le champ doit afficher le mot de passe
    expect(passwordField.type).toBe('text');
  });

  /**
   * Test 3 : Activation ou désactivation du bouton de soumission du formulaire
   * - Le bouton doit être désactivé si le formulaire est invalide.
   * - Le bouton doit être activé lorsque le formulaire est valide.
   */
  it('should toggle the submit button based on form validity', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

    // Cas formulaire invalide
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy(); // Bouton est désactivé

    // Cas formulaire valide
    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('validPassword123');
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy(); // Bouton est activé
  });

  /**
   * Test 4 : Vérification de l'absence de message d'erreur par défaut
   * - Par défaut, le message d'erreur ne doit pas être visible.
   */
  it('should not show the error message by default', () => {
    const errorMessage = fixture.nativeElement.querySelector('.error');
    expect(errorMessage).toBeFalsy();
  });

  /**
   * Test 5 : Validation des champs vides
   * - Les champs email et mot de passe doivent être invalide lorsqu'ils sont vides.
   */
  it('should display validation errors when fields are empty', () => {
    const emailControl = component.form.controls['email'];
    const passwordControl = component.form.controls['password'];

    emailControl.setValue('');
    passwordControl.setValue('');
    fixture.detectChanges();

    expect(emailControl.invalid).toBeTruthy();
    expect(passwordControl.invalid).toBeTruthy();
  });

  /**
   * Test 6 : Vérification des classes CSS d'invalidité
   * - Les champs email et mot de passe doivent avoir la classe 'ng-invalid' lorsqu'ils sont vides.
   */
  it('should mark email and password fields as invalid when left empty', () => {

    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');

    fixture.detectChanges();

    const emailField = fixture.nativeElement.querySelector('input[formControlName="email"]');
    const passwordField = fixture.nativeElement.querySelector('input[formControlName="password"]');
    expect(emailField.classList).toContain('ng-invalid');
    expect(passwordField.classList).toContain('ng-invalid');
  });

});
