import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { MeComponent } from './me.component';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import {mockSessionInformation, mockUser} from "../../mocks/mock-data";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";


describe('MeComponent - Integration Test', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      providers: [
        UserService,
        SessionService,
      ]
    }).compileComponents();

    // Création du composant et récupération des services injectés
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    sessionService.sessionInformation = {...mockSessionInformation, id: 1};

    fixture.detectChanges();
  });

  /**
   * Test 1: Vérifie que les données utilisateur sont bien récupérées lors de l'initialisation du composant.
   */
  it('should fetch user data on init', () => {
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));

    component.ngOnInit();
    fixture.detectChanges();

    expect(userService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  /**
   * Test 2: Vérifie que la suppression de l'utilisateur fonctionne et déclenche les actions associées.
   */
  it('should delete user, log out and navigate to home', () => {
    jest.spyOn(userService, 'delete').mockReturnValue(of(null));
    jest.spyOn(sessionService, 'logOut');
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.delete();
    fixture.detectChanges();

    expect(userService.delete).toHaveBeenCalledWith('1');
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  /**
   * Test 3: Vérifie que la méthode back() permet bien de retourner à la page précédente.
   */
  it('should go back to the previous page when back method is called', () => {
    const spyBackHistory = jest.spyOn(window.history, 'back');
    component.back();
    expect(spyBackHistory).toHaveBeenCalled();
  });
});
