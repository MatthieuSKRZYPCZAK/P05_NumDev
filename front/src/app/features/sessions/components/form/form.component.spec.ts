import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import {ActivatedRoute, Router} from "@angular/router";
import {mockSession, mockSessionForm} from "../../../../mocks/mock-data";
import {of} from "rxjs";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiService: SessionApiService;
  let router: Router;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  const mockSessionApiService: Partial<SessionApiService> = {
    detail: jest.fn().mockReturnValue(of({})),
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({})),
  }

  const mockRouter: Partial<Router> = {
    navigate: jest.fn(), url:''
  }

  const mockActivatedRoute = {
   snapshot: { paramMap: { get: () => '' } }
  }

  const mockSnackBar: Partial<MatSnackBar> = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    sessionApiService = TestBed.inject(SessionApiService);
  });

  /**
   * Test 1 : Vérification de la création du composant
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test 2 : Redirige l'utilisateur s'il n'est pas administrateur
   */
  it('should redirect if user is not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.ngOnInit();
    expect(mockSessionService.sessionInformation.admin).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/sessions']);
  });

  /**
   * Test 3 : Initialise une nouvelle session si l'url ne contient pas update
   */
  it('should initialize a new session if URL does not contain update', () => {
    Object.defineProperty(router, 'url', { get: () => '/sessions/create'});

    const initFormSpy = jest.spyOn(component as any, 'initForm');
    component.ngOnInit();

    expect(component.onUpdate).toBe(false);
    expect(initFormSpy).toHaveBeenCalled();
  });

  /**
   * Test 4 : Initialise une session existante si l'url contient update
   */
  it('should initialize session form with data when URL contains update', () => {
    Object.defineProperty(router, 'url', { get: () => '/sessions/update/1' });
    Object.defineProperty(mockActivatedRoute.snapshot.paramMap, 'get', { value: () => '1' });
    const sessionApiSpy = jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession[0]));
    const initFormSpy = jest.spyOn(component as any, 'initForm');

    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect(component['id']).toBe('1');
    expect(sessionApiSpy).toHaveBeenCalledWith('1');
    expect(initFormSpy).toHaveBeenCalledWith(mockSession[0]);
  });


  /**
   * Test 5 : Crée une session lorsque le formulaire est soumis et que l'on n'est pas en mode update
   */
  it('should create a session when submit is called with onUpdate set to false', () => {
    const sessionApiSpy = jest.spyOn(mockSessionApiService, 'create').mockReturnValue(of(mockSession[0]));
    const pageSpy = jest.spyOn<any, string>(component, 'exitPage');
    component.onUpdate = false;
    component.sessionForm?.setValue(mockSessionForm);
    expect(component.sessionForm?.valid).toBe(true);

    component.submit();

    expect(component.sessionForm?.value).toEqual(mockSessionForm);
    expect(component.onUpdate).toBe(false);
    expect(sessionApiSpy).toHaveBeenCalledWith(mockSessionForm);
    expect(pageSpy).toHaveBeenCalledWith('Session created !');
  });

  /**
   * Test 6 : Met à jour une session lorsque le formulaire est soumis et que l'on est en mode update
   */
  it('should update a session when submit is called with onUpdate set to true', () => {
    const sessionApiSpy = jest.spyOn(mockSessionApiService, 'update').mockReturnValue(of(mockSession[1]));
    const pageSpy = jest.spyOn<any, string>(component, 'exitPage');
    component.onUpdate = true;
    component['id'] = '1';

    component.sessionForm?.setValue(mockSessionForm);

    expect(component.sessionForm?.valid).toBe(true);

    component.submit();

    expect(component.sessionForm?.value).toEqual(mockSessionForm);
    expect(sessionApiSpy).toHaveBeenCalledWith('1',mockSessionForm);
    expect(pageSpy).toHaveBeenCalledWith('Session updated !');
  });

  /**
   * Test 7 : Affiche un message et redirige l'utilisateur
   */
  it('should display message and navigate to sessions on exitPage', () => {
    component['exitPage']('Test');

    expect(mockSnackBar.open).toHaveBeenCalledWith('Test', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

});
