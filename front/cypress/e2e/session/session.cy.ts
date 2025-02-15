/// <reference types="cypress" />
import CypressConfig from "../../../cypress.config";

describe('Session spec', () => {

  // Données de sessions tests
  const teachers = [
    {
      id: 1,
      firstName: 'Albus',
      lastName: 'Dumbledore',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      firstName: 'Minerva',
      lastName: 'McGonagall',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const sessions = [
    {
      id: 1,
      name: 'Test Session 1',
      description:  'Test Description 1',
      date: '2025-03-01',
      teacher_id: 1,
      users: [1,2],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Test Session 2',
      description:  'Test Description 2',
      date: '2025-03-02',
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  const newSession = {
    id: 3,
    name: 'Test Session 3',
    description:  'Test Description 3',
    date: '2025-03-03',
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updateSession =
    {
      ...sessions[0],
      name: 'New Teacher session',
      description: 'Change teacher',
      teacher_id: 2
    };

  const updateSessions =
    [
      {
        ...sessions[0],
        name: 'New Teacher session',
        description: 'Change teacher',
        teacher_id: 2
      },
      {
        ...sessions[1]
      }
    ];

  // Utilisateur administrateur
  const userAdmin = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
    admin: true
  };

  // Utilisateur non adminstrateur
  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
    admin: false
  };

  // Fonction permettant de simuler la connexion d'un utilisateur
  function loginAs(user: any) {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: user }).as('login');
    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
    cy.get('button[type="submit"]').click();
  };

  // Fonction permettant de configurer les interceptions API utilisées dans les tests
  function setupInterceptions() {
    cy.intercept('GET', '/api/session', { body: sessions }).as('sessions');
    cy.intercept('GET', '/api/teacher', { body: teachers }).as('teachers');
  };

  describe('Admin Creation session', () => {

    // Avant chaque test
    beforeEach(() => {
      setupInterceptions();
      loginAs(userAdmin);
    });

    it("should display the session list", () => {
      // Vérifie que la liste des sessions s'affiche
      cy.get('mat-card.item').contains(sessions[0].name);
      cy.get('mat-card.item').contains(sessions[1].name);
    });

    it('should display the "Create session" title and not show "Update session', () => {

      // Vérifie que l'on est bien sur la page de création et pas de mise à jour

      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click();
      cy.url().should('eq', Cypress.config().baseUrl + 'sessions/create');
      cy.contains('h1', 'Create session').should('exist');
      cy.contains('h1', 'Update session').should('not.exist');
    });

    it('should contain the Name, Date, Teacher, and Description fields', () => {
      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click();

      cy.url().should('eq', Cypress.config().baseUrl + 'sessions/create');

      cy.get('input[formControlName="name"]').should('exist');
      cy.get('input[formControlName="date"]').should('exist');
      cy.get('mat-select[formControlName="teacher_id"]').should('exist');
      cy.get('textarea[formControlName="description"]').should('exist');

      cy.get('button[type="submit"]').contains('Save').should('not.be.disabled');
    });

    it('should display an error when required fields are empty', () => {
      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click();

      cy.get('input[formControlName=name]').should('have.class', 'ng-invalid');
      cy.get('input[formControlName=date]').should('have.class', 'ng-invalid');
      cy.get('mat-select[formControlName=teacher_id]').should('have.class', 'ng-invalid');
      cy.get('textarea[formControlName=description]').should('have.class', 'ng-invalid');

      cy.get('button[type="submit"]').contains('Save').should('not.be.disabled');
    });

    it('should successfully create a session', () => {
      const newSessions = [
        ...sessions,
      newSession
      ]

      cy.intercept('GET', '/api/teacher', {
        body: teachers
      }).as('teachers');

      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click();
      cy.url().should('eq', Cypress.config().baseUrl + 'sessions/create');

      cy.get('input[formControlName="name"]').type('Test Session');
      cy.get('input[formControlName="date"]').type('2025-03-01');

      cy.get('mat-select[formControlName="teacher_id"]').click();

      cy.wait('@teachers');

      cy.get('mat-option').first().click();

      cy.get('textarea[formControlName="description"]').type('Test Description');
      cy.get('button[type="submit"]').contains('Save').should('not.be.disabled');

      cy.intercept('POST', '/api/session', {
        statusCode: 201,
        body: newSession
      });

      cy.intercept('GET', '/api/session', {
        body: newSessions
      });

      cy.get('button[type="submit"]').contains('Save').click();
      cy.get('snack-bar-container').contains('Session created !').should('exist');
      cy.url().should('eq', Cypress.config().baseUrl + 'sessions');

      cy.get('mat-card.item').contains(newSessions[0].name);
      cy.get('mat-card.item').contains(newSessions[1].name);
      cy.get('mat-card.item').contains(newSessions[2].name);

      cy.get('mat-card').contains('Edit').should('exist');
    });

    it('should details session', () => {

      cy.intercept('GET', `/api/session/${sessions[0].id}`,{
        body: sessions[0]
        });

      cy.intercept('GET', '/api/teacher', {
        body: teachers
      });

      cy.get('mat-card.item').contains(sessions[0].name);

      cy.contains('mat-card.item', sessions[0].name)
        .within(() => {
          cy.contains('button', 'Edit').click()
        });

      cy.url().should('eq', Cypress.config().baseUrl + `sessions/update/${sessions[0].id}`);

      cy.contains('h1', 'Update session').should('exist');
      cy.contains('h1', 'Create session').should('not.exist');

    });

  });

  describe('Admin Update and Delete session', () => {

    beforeEach(() => {

      setupInterceptions();
      loginAs(userAdmin);

      cy.intercept('GET', `/api/session/${sessions[0].id}`,{
        body: sessions[0]
      });

      cy.get('mat-card.item').contains(sessions[0].name)
      cy.contains('mat-card.item', sessions[0].name)
        .within(() => {
          cy.contains('button', 'Edit').click()
        });

    });

    it('should successfully update a session', () => {

      cy.intercept('PUT', `/api/session/${sessions[0].id}`, {
        body: updateSession
      });

      cy.contains('h1', 'Update session').should('exist');
      cy.contains('h1', 'Create session').should('not.exist');

      cy.get('input[formControlName="name"]').clear();
      cy.get('input[formControlName="name"]').type(`${updateSession.name}`);
      cy.get('mat-select[formControlName="teacher_id"]').click();
      cy.get('mat-option').contains(`${teachers[1].firstName}`).click();
      cy.get('textarea[formControlName="description"]').clear();
      cy.get('textarea[formControlName="description"]').type(`${updateSession.description}`);

      cy.intercept('GET', '/api/session', {
        body: updateSessions
      })
      cy.get('button[type="submit"]').click();

      cy.url().should('eq', Cypress.config().baseUrl + `sessions`);
      cy.get('mat-card.item').contains(updateSession.name);
      cy.get('mat-card.item').contains(updateSession.description);
      cy.get('snack-bar-container').contains('Session updated !').should('exist');

    });

    it('should successfully delete a session', () => {
      cy.intercept('GET', '/api/session', {
        body: updateSessions
      });
      cy.get('[routerLink=sessions]').click();

      cy.intercept('GET', `/api/session/${updateSession.id}`, {
        body: updateSession
      });

      cy.intercept('DELETE', `/api/session/${updateSession.id}`, {
        statusCode: 204,
      });

      cy.contains('mat-card.item', updateSessions[0].name)
        .within(() => {
          cy.contains('button', 'Detail').click()
        });

      cy.url().should('eq', Cypress.config().baseUrl + `sessions/detail/${sessions[0].id}`);

      cy.get('Button').contains('Delete').should('exist');
      cy.get('Button').contains('Participate').should('not.exist');

      cy.intercept('GET', '/api/session', {
        body: sessions[2]
      });

      cy.get('Button').contains('Delete').click();

      cy.get('snack-bar-container').contains('Session deleted !').should('exist');
      cy.url().should('eq', Cypress.config().baseUrl + `sessions`);

    });

  });


  describe('Session with a non-admin', () => {
    beforeEach(() => {
      setupInterceptions();
      loginAs(user);
    });

      it("should display session details and show Participate button for a non-admin user", () => {
        cy.intercept('GET', `/api/session/${sessions[1].id}`,{
          body: sessions[1]
        });

        cy.intercept('GET', `/api/teacher/${sessions[0].teacher_id}`, {
          body: teachers[0]
        });

        cy.get('mat-card.item').contains(sessions[0].name);
        cy.get('mat-card.item').contains(sessions[1].name);

        cy.get('button').contains('Detail').should('exist');
        cy.contains('mat-card.item', sessions[1].name)
          .within(() => {
            cy.contains('button', 'Detail').should('exist');
          });
        cy.contains('mat-card.item', sessions[1].name)
          .within(() => {
            cy.contains('button', 'Detail').click();
          });

        cy.url().should('eq', Cypress.config().baseUrl + `sessions/detail/${sessions[1].id}`);

        cy.contains('h1', `${sessions[1].name}`).should('exist');
        cy.contains('span', `${teachers[0].firstName} ${teachers[0].lastName.toUpperCase()}`).should('exist');
        cy.contains('div', `${sessions[1].description}`).should('exist');
        cy.contains('span', '0 attendees').should('exist');

        cy.get('button').contains('Participate').should('exist');
        cy.get('button').contains('Do not Participate').should('not.exist');
      });


      it('should update session details when clicking Participate', () => {

        cy.intercept('GET', `/api/session/${sessions[1].id}`,{
          body: sessions[1]
        });

        cy.intercept('GET', `/api/teacher/${sessions[0].teacher_id}`, {
          body: teachers[0]
        });

        cy.get('mat-card.item').contains(sessions[0].name);
        cy.get('mat-card.item').contains(sessions[1].name);


        cy.get('button').contains('Detail').should('exist');
        cy.contains('mat-card.item', sessions[1].name)
          .within(() => {
            cy.contains('button', 'Detail').should('exist');
          });
        cy.contains('mat-card.item', sessions[1].name)
          .within(() => {
            cy.contains('button', 'Detail').click();
          });

        cy.intercept('POST', `/api/session/${sessions[1].id}/participate/${user.id}`,{
          statusCode: 200
        }).as('participateSession');


        cy.intercept('GET', `/api/session/${sessions[1].id}`,{
          body:  { ...sessions[1], users: [1]}
        }).as('getUpdatedSession');

        cy.get('button').contains('Participate').click();

        cy.wait('@participateSession');
        cy.wait('@getUpdatedSession');

        cy.get('button').contains('Do not participate').should('exist');
        cy.contains('span', '0 attendees').should('not.exist');
        cy.contains('span', '1 attendees').should('exist');

      });

      it('should update session details when clicking unParticipate', () => {
        cy.intercept('GET', `/api/session/${sessions[1].id}`,{
          body: { ...sessions[1], users: [1]}
        });

        cy.intercept('GET', `/api/teacher/${sessions[0].teacher_id}`, {
          body: teachers[0]
        });

        cy.contains('mat-card.item', sessions[1].name)
          .within(() => {
            cy.contains('button', 'Detail').click()
          });


        cy.intercept('DELETE', `/api/session/${sessions[1].id}/participate/${user.id}`,{
            statusCode: 200
          }).as('unparticipateSession');


        cy.intercept('GET', `/api/session/${sessions[1].id}`,{
          body:  sessions[1]
        }).as('getUpdatedUnparticipateSession');

        cy.intercept('GET', `/api/teacher/${sessions[0].teacher_id}`, {
          body: teachers[0]
        });


        cy.get('button').contains('Do not participate').click();

        cy.wait('@unparticipateSession');
        cy.wait('@getUpdatedUnparticipateSession');

        cy.get('button').contains('Do not participate').should('not.exist');

        cy.contains('span', '0 attendees').should('exist')
        cy.contains('span', '1 attendees').should('not.exist')
      });

    });
});
