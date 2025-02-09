import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import {of} from "rxjs";
import {SessionApiService} from "../../services/session-api.service";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {mockSession, mockSessionService, mockTeachers} from "../../../../mocks/mock-data";
import {TeacherService} from "../../../../services/teacher.service";


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const mockMatSnackBar: Partial<MatSnackBar> = {
    open: jest.fn()
  }

  const mockRouter: Partial<Router> = {
    navigate: jest.fn()
  }

  const mockSessionApiService: Partial<SessionApiService> = {
    detail: jest.fn().mockReturnValue(of(mockSession[0])),
    delete: jest.fn().mockReturnValue(of(null)),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null))
  }

  const mockTeacherService: Partial<TeacherService> = {
    detail: jest.fn().mockReturnValue(of(mockTeachers[0]))
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TeacherService, useValue: mockTeacherService }

      ],
    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test 1: Vérification de la création du service.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test 2: Vérifie que la méthode fetchSession est bien appelée lors de l'initialisation.
   */
  it('should call fetchSession on ngOnInit()', () =>  {
    const fetchSessionSpy = jest.spyOn(component as any, 'fetchSession');
    component.ngOnInit();
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

  /**
   * Test 3: Vérifie que la méthod back() permet bien de retourner à la page précédente.
   */
  it('should go back to the previous page when back method is called', () => {
    const backHistorySpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(backHistorySpy).toHaveBeenCalled();
  });

  /**
   * Test 4: Vérifie que la suppression d'une session fonctionne et déclenche bien la navigation.
   */
  it('should delete session and navigate to sessions list', () => {
    component.sessionId = '1';
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  /**
   * Test 5: Vérifie que l'inscription à une session est bien enregistrée.
   */
  it('should allow user to participate in a session', () => {
    component.participate();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  /**
   * Test 6: Vérifie que la désinscription à une session est bien enregistrée.
   */
  it('should allow user to unParticipate from a session', () => {
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  /**
   * Test 7: Vérifie que la récupération des détails de la session et de l'enseignant fonctionne correctement.
   */
  it('should fetch session details and teacher details', () => {
    component['fetchSession']();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession[0]);
    expect(mockTeacherService.detail).toHaveBeenCalledWith(mockSession[0].teacher_id.toString());
    expect(component.teacher).toEqual(mockTeachers[0]);

  });
});
