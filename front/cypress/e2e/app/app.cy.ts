/// <reference types="cypress" />
import CypressConfig from "../../../cypress.config";

describe('App spec', () => {

  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
    admin: false
  };

  const session =
    {
      id: 1,
      name: 'Test Session 1',
      description:  'Test Description 1',
      date: '2025-03-01',
      teacher_id: 1,
      users: [1,2],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  function loginAs(user: any) {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: user }).as('login');
    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
    cy.get('button[type="submit"]').click();
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('should show Login and Register when user is not logged in', () => {
    cy.visit('/');

    cy.get('mat-toolbar').contains('Login').should('exist');
    cy.get('mat-toolbar').contains('Register').should('exist');

    cy.get('mat-toolbar').contains('Sessions').should('not.exist');
    cy.get('mat-toolbar').contains('Logout').should('not.exist');
    cy.get('mat-toolbar').contains('Account').should('not.exist');
  });

  it('should display "Logout" when user is logged in', () => {

    loginAs(user);
    cy.intercept('GET', '/api/session', { body: session }).as('sessions');

    cy.get('mat-toolbar').contains('Logout').should('exist');
    cy.get('mat-toolbar').contains('Account').should('exist');
    cy.get('mat-toolbar').contains('Sessions').should('exist');

    cy.get('mat-toolbar').contains('Login').should('not.exist');
    cy.get('mat-toolbar').contains('Register').should('not.exist');

  });

})

