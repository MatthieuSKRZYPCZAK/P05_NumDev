/// <reference types="cypress" />
import CypressConfig from "../../cypress.config";

describe('Session spec', () => {

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
  ]
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
  ]

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
    }

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
    ]


  describe('Admin Creation session', () => {

    const userAdmin = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password12345',
      admin: true
    }

    beforeEach(() => {
      cy.visit('/login')
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
        body: userAdmin,
      }).as('loginSuccess')

      cy.intercept('GET', '/api/session', {
        body: sessions
      }).as('sessions')

      cy.get('input[formControlName=email]').type(`${userAdmin.email}`)
      cy.get('input[formControlName=password]').type(`${userAdmin.password}`)

      cy.get('button[type="submit"]').click();
    });

    it("should display the session list", () => {
      cy.get('mat-card.item').contains(sessions[0].name);
      cy.get('mat-card.item').contains(sessions[1].name);
    })

    it('should display the "Create session" title and not show "Update session', () => {

      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click()

      cy.url().should('eq', Cypress.config().baseUrl + 'sessions/create')

      cy.contains('h1', 'Create session').should('exist')
      cy.contains('h1', 'Update session').should('not.exist')

    });

    it('should contain the Name, Date, Teacher, and Description fields', () => {
      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click()

      cy.url().should('eq', Cypress.config().baseUrl + 'sessions/create')

      cy.get('input[formControlName="name"]').should('exist');
      cy.get('input[formControlName="date"]').should('exist');
      cy.get('mat-select[formControlName="teacher_id"]').should('exist');
      cy.get('textarea[formControlName="description"]').should('exist');

      cy.get('button[type="submit"]').contains('Save').should('not.be.disabled');
    });

    it('should display an error when required fields are empty', () => {
      cy.get('button').contains('Create').should('exist');
      cy.contains('button', 'Create').click()

      cy.get('input[formControlName=name]').should('have.class', 'ng-invalid')
      cy.get('input[formControlName=date]').should('have.class', 'ng-invalid')
      cy.get('mat-select[formControlName=teacher_id]').should('have.class', 'ng-invalid')
      cy.get('textarea[formControlName=description]').should('have.class', 'ng-invalid')

      cy.get('button[type="submit"]').contains('Save').should('not.be.disabled');
    });

    it('should successfully create a session', () => {
      const newSessions = [
        ...sessions,
      newSession
      ]

      cy.intercept('GET', '/api/teacher', {
        body: teachers
      }).as('teachers')


      cy.get('button').contains('Create').should('exist')
      cy.contains('button', 'Create').click()
      cy.url().should('eq', Cypress.config().baseUrl + 'sessions/create')

      cy.get('input[formControlName="name"]').type('Test Session')
      cy.get('input[formControlName="date"]').type('2025-03-01')

      cy.get('mat-select[formControlName="teacher_id"]').click()

      cy.wait('@teachers')

      cy.get('mat-option').first().click()

      cy.get('textarea[formControlName="description"]').type('Test Description')
      cy.get('button[type="submit"]').contains('Save').should('not.be.disabled');

      cy.intercept('POST', '/api/session', {
        statusCode: 201,
        body: newSession
      })

      cy.intercept('GET', '/api/session', {
        body: newSessions
      })
      cy.get('button[type="submit"]').contains('Save').click()
      cy.get('snack-bar-container').contains('Session created !').should('exist');
      cy.url().should('eq', Cypress.config().baseUrl + 'sessions')

      cy.get('mat-card.item').contains(newSessions[0].name);
      cy.get('mat-card.item').contains(newSessions[1].name);
      cy.get('mat-card.item').contains(newSessions[2].name);

      cy.get('mat-card').contains('Edit').should('exist');
    });

    it('should details session', () => {

      cy.intercept('GET', `/api/session/${sessions[0].id}`,{
        body: sessions[0]
        })

      cy.intercept('GET', '/api/teacher', {
        body: teachers
      })

      cy.get('mat-card.item').contains(sessions[0].name)

      cy.contains('mat-card.item', sessions[0].name)
        .within(() => {
          cy.contains('button', 'Edit').click()
        });

      cy.url().should('eq', Cypress.config().baseUrl + `sessions/update/${sessions[0].id}`)

      cy.contains('h1', 'Update session').should('exist')
      cy.contains('h1', 'Create session').should('not.exist')

    });

  })

  describe('Admin Update and Delete session', () => {

    const userAdmin = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password12345',
      admin: true
    }

    beforeEach(() => {
      cy.visit('/login')
      cy.intercept('POST', '/api/auth/login', {
        body: userAdmin,
      })

      cy.intercept('GET', '/api/session', {
        body: sessions
      })

      cy.get('input[formControlName=email]').type(`${userAdmin.email}`)
      cy.get('input[formControlName=password]').type(`${userAdmin.password}`)

      cy.get('button[type="submit"]').click();

      cy.intercept('GET', `/api/session/${sessions[0].id}`,{
        body: sessions[0]
      })

      cy.intercept('GET', '/api/teacher', {
        body: teachers
      })

      cy.get('mat-card.item').contains(sessions[0].name)

      cy.contains('mat-card.item', sessions[0].name)
        .within(() => {
          cy.contains('button', 'Edit').click()
        });
    });

    it('should successfully update a session', () => {

      cy.intercept('PUT', `/api/session/${sessions[0].id}`, {
        body: updateSession
      })

      cy.contains('h1', 'Update session').should('exist')
      cy.contains('h1', 'Create session').should('not.exist')

      cy.get('input[formControlName="name"]').clear()
      cy.get('input[formControlName="name"]').type(`${updateSession.name}`)
      cy.get('mat-select[formControlName="teacher_id"]').click()
      cy.get('mat-option').contains(`${teachers[1].firstName}`).click()
      cy.get('textarea[formControlName="description"]').clear()
      cy.get('textarea[formControlName="description"]').type(`${updateSession.description}`)

      cy.intercept('GET', '/api/session', {
        body: updateSessions
      })
      cy.get('button[type="submit"]').click();

      cy.url().should('eq', Cypress.config().baseUrl + `sessions`)
      cy.get('mat-card.item').contains(updateSession.name)
      cy.get('mat-card.item').contains(updateSession.description)
      cy.get('snack-bar-container').contains('Session updated !').should('exist');

    });

    it('should successfully delete a session', () => {
      cy.intercept('GET', '/api/session', {
        body: updateSessions
      })
      cy.get('[routerLink=sessions]').click();

      cy.intercept('GET', `/api/session/${updateSession.id}`, {
        body: updateSession
      }).as('delete')

      cy.intercept('DELETE', `/api/session/${updateSession.id}`, {
        statusCode: 204,
      })

      cy.contains('mat-card.item', updateSessions[0].name)
        .within(() => {
          cy.contains('button', 'Detail').click()
        });

      cy.url().should('eq', Cypress.config().baseUrl + `sessions/detail/${sessions[0].id}`)

      cy.get('Button').contains('Delete').should('exist')
      cy.get('Button').contains('Participate').should('not.exist')

      cy.intercept('GET', '/api/session', {
        body: sessions[2]
      })

      cy.get('Button').contains('Delete').click()
      cy.wait('@delete')

      cy.get('snack-bar-container').contains('Session deleted !').should('exist');
      cy.url().should('eq', Cypress.config().baseUrl + `sessions`)

    });

  })


  describe('Session with a non-admin', () => {

    const user = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password12345',
      admin: false
    }

    beforeEach(() => {
      cy.visit('/login')

      cy.get('input[formControlName=email]').type(`${user.email}`)
      cy.get('input[formControlName=password]').type(`${user.password}`)

      cy.get('button[type="submit"]').click()
    });

  })

});
