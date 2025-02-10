import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {Observable, of} from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatIconModule } from "@angular/material/icon";


describe('RegisterComponent - Integration Test', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
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
      providers: [AuthService]
    }).compileComponents();

    // Création du composant et récupération des services injectés
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });


  /**
   * Test 1 : Vérifie que l'utilisateur est inscrit et rédirigé après l'inscription réussie
   */
  it('should register user and navigate to /login after successful registration', () => {

    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123'
    });

    // Soumet le formulaire
    component.submit();

    // Vérifie que `register()` a bien été appelé avec les bonnes valeurs
    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123'
    });

    // Vérifie que la navigation vers `/login` est bien déclenchée
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  /**
   * Test 2 : Vérifie que le message d'erreur s'affiche en cas d'échec d'inscription
   */
  it('should display an error message if registration fails', () => {

    jest.spyOn(authService, 'register').mockImplementation(() => {
      return new Observable<void>((subscriber) => {
        subscriber.error(new Error('error'));
      });
    });

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123'
    });

    // Soumet le formulaire
    component.submit();

    // Vérifie que l'erreur est bien détectée
    expect(component.onError).toBe(true);

    fixture.detectChanges();

    // Vérifie si un message d'erreur est affiché
    const errorElement = fixture.nativeElement.querySelector('.error');
    expect(errorElement).toBeTruthy();

  });
});
