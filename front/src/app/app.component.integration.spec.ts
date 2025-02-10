import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';

describe('AppComponent - Integration Test', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatToolbarModule
      ],
      providers: [SessionService]
    }).compileComponents();

    // Création du composant et récupération des services injectés
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  /**
   * Test 1 : Vérifie que l'application récupère le statut de connexion
   */
  it('should return the correct login status', () => {
    jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(true));

    component.$isLogged().subscribe(status => {
      expect(status).toBe(true);
    });

    expect(sessionService.$isLogged).toHaveBeenCalled();
  });

  /**
   * Test 2 : Vérifie que la déconnexion fonctionne et redirige vers la route racine ('')
   */
  it('should log out and navigate to the root', () => {
    jest.spyOn(sessionService, 'logOut');
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    component.logout();

    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});

