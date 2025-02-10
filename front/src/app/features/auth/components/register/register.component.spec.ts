import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {of, throwError} from "rxjs";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;

  beforeEach(async () => {

    authServiceMock = {
      register: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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
   * Test 2 : Affichage des erreurs si des champs sont obligatoires mais manquants
   */
  it('should display validation errors for missing required fields', () => {

    component.form.controls['email'].setValue('');
    component.form.controls['firstName'].setValue('');
    component.form.controls['lastName'].setValue('');
    component.form.controls['password'].setValue('');
    fixture.detectChanges();

    expect(component.form.controls['email'].invalid).toBe(true);
    expect(component.form.controls['firstName'].invalid).toBe(true);
    expect(component.form.controls['lastName'].invalid).toBe(true);
    expect(component.form.controls['password'].invalid).toBe(true);

    const emailInput = fixture.nativeElement.querySelector('input[formControlName="email"]');
    const firstNameInput = fixture.nativeElement.querySelector('input[formControlName="firstName"]');
    expect(emailInput.classList).toContain('ng-invalid');
    expect(firstNameInput.classList).toContain('ng-invalid');
  });

  /**
   * Test 3 : Affichage d'une erreur en cas de problème lors de la soumission
   */
  it('should display an error message if registration fails', () => {

    authServiceMock.register = jest.fn().mockReturnValue(throwError(() => new Error('Registration error')));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'myPassword123'
    });

    component.submit();

    expect(component.onError).toBe(true);

    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('An error occurred');
  });

  /**
   * Test 4 : Désactivation du bouton de soumission lorsque le formulaire est invalide
   */
  it('should disable the submit button if the form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');

    component.form.setValue({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy();

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123'
    });
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalsy();
  });

});
