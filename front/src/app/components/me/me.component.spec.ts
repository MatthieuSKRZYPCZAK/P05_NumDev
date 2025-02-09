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
  let userService: UserService;
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

    userService = TestBed.inject(UserService)
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
   * Test 2: Vérifie que les données utilisateur sont bien récupérées lors de l'initialisation du composant
   */
  it('should fetch user data on init', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  /**
   * Test 3: Vérifie que le bouton de suppression ne s'affiche pas si l'utilisateur est administrateur
   */
  it('should display delete button if user is admin', () => {
    component.user = { ...mockUser, admin: true };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).toBeNull();
  });

  /**
   * Test 4: Vérifie que le bouton de suppression est affiché si l'utilisateur n'est pas administrateur
   */
  it('should display delete button if user is not admin', () => {
    component.user = { ...mockUser, admin: false };
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
    expect(deleteButton).not.toBeNull();
  });

  /**
   * Test 5: Vérifie que l'utilisateur est bien supprimé et que la déconnexion ainsi que la redirection sont effectuées.
   */
  it('should delete user and log out', done => {
      const logOutSpy = jest.spyOn(sessionService, 'logOut');
      const routerSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
      const snackBarSpy = jest.spyOn(snackBar, 'open');

      // Exécute la suppression de l'utilisateur
      component.delete();
      fixture.detectChanges();

      // Vérifie que delete() a bien été appelé avec l'ID utilisateur
      expect(mockUserService.delete).toHaveBeenCalledWith('1');

      // Vérifie que la déconnexion et la navigation ont bien eu lieu
      expect(logOutSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
      expect(snackBarSpy).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      done();

  });

  /**
   * Vérifie que la méthod back() permet bien de retourner à la page précédente.
   */
  it('should go back to the previous page when back method is called', () => {

    const spyBackHistory = jest.spyOn(window.history, 'back');
    component.back();
    expect(spyBackHistory).toHaveBeenCalled();
  })
});
