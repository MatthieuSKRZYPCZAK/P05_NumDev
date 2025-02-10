import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import {UserService} from "../../services/user.service";
import { mockUser } from "../../mocks/mock-data";
import {Router} from "@angular/router";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let router: Router;
  let snackBar: MatSnackBar;
  let sessionService: SessionService;

  // Mock du service de session
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  };

  // Mock du service utilisateur
  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)), // Retourne l'utilisateur fictif
    delete: jest.fn().mockReturnValue(of(null)) // Retourne un Observable vide
  };

  // Mock de MatSnackBar
  let mockMatSnackBar: Partial<MatSnackBar> = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    sessionService = TestBed.inject(SessionService);

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Supprime les appels et instance mémorisées
  })

  /**
   * Test 1: Vérification de la création du composant
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test 2: Vérifie que le bouton de suppression ne s'affiche pas si l'utilisateur est administrateur
   */
  it('should display delete button if user is admin', () => {
    component.user = { ...mockUser, admin: true };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeNull();
  });

  /**
   * Test 3: Vérifie que le bouton de suppression est affiché si l'utilisateur n'est pas administrateur
   */
  it('should display delete button if user is not admin', () => {
    component.user = { ...mockUser, admin: false };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).not.toBeNull();
  });


});
