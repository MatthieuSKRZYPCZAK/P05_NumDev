/// <reference types="cypress" />
import CypressConfig from "../../../cypress.config";

describe('Login spec', () => {

  const userAdmin = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
    admin: true
  }

  const user = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
    admin: false
  }

  function loginAs(user: any) {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: user }).as('login');
    cy.get('input[formControlName=email]').type(user.email);
    cy.get('input[formControlName=password]').type(user.password);
    cy.get('button[type="submit"]').click();
  };

  // Page de login avant chaque test
  beforeEach(() => {
    cy.visit('/login')
  });


  it('Login successfull', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: user,
    }).as('loginSuccess')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type(`${user.email}`)
    cy.get('input[formControlName=password]').type(`${user.password}`)

    cy.get('button[type="submit"]').contains('Submit').should('not.be.disabled');
    cy.get('button[type="submit"]').contains('Submit').click();

    cy.wait('@loginSuccess')
    cy.wait('@session')

    cy.url().should('include', '/sessions')
    cy.get('.error').should('not.exist')
  })

  it('Login with incorrect password', () => {
    cy.get('input[formControlName=email]').type(`${user.email}`)
    cy.get('input[formControlName=password]').type(`${user.password}`)

    cy.get('button[type="submit"]').contains('Submit').should('not.be.disabled');
    cy.get('button[type="submit"]').contains('Submit').click();

    cy.get('.error').should('be.visible').and('contain', 'An error occurred')

  })

  it('Login with incorrect email', () => {
    cy.get('input[formControlName=email]').type("wrongMail@studio.com")
    cy.get('input[formControlName=password]').type(`${user.password}{enter}{enter}`)

    cy.get('.error').should('be.visible').and('contain', 'An error occurred')
  })

  it('Login with an invalid password format', () => {
    cy.get('input[formControlName=email]').type(`${""}{enter}`)
    cy.get('input[formControlName=password]').type(`${""}{enter}`)

    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.get('button[type="submit"]').should('be.disabled');
  })

  it('Login with an empty password and email field', () => {
    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.get('input[formControlName=password]').should('have.class', 'ng-invalid')

    cy.get('button[type="submit"]').should('be.disabled');
  })

  it('Toggles password visibility when clicking the visibility button', () => {

    cy.get('input[formControlName=email]').type(`${user.email}`)
    cy.get('input[formControlName=password]').type(`${user.password}`)

    cy.get('input[formControlName=password]').should('have.attr', 'type', 'password')
    cy.get('button[mat-icon-button]').find('mat-icon').should('have.text', 'visibility_off')
    cy.get('button[mat-icon-button]').click()
    cy.get('input[formControlName=password]').should('have.attr', 'type', 'text')
    cy.get('button[mat-icon-button]').find('mat-icon').should('have.text', 'visibility')
    cy.get('button[mat-icon-button]').click()
    cy.get('input[formControlName=password]').should('have.attr', 'type', 'password')
    cy.get('button[mat-icon-button]').find('mat-icon').should('have.text', 'visibility_off')
  })

  it('Logout successfull', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: user,
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')
    cy.get('input[formControlName=email]').type(`${user.email}`)
    cy.get('input[formControlName=password]').type(`${user.password}`)

    cy.get('button[type="submit"]').contains('Submit').should('not.be.disabled');
    cy.get('button[type="submit"]').contains('Submit').click();

    cy.url().should('eq', Cypress.config().baseUrl + 'sessions')
    cy.get('.link').contains('Logout').click()
    cy.get('.error').should('not.exist')
    cy.url().should('eq', Cypress.config().baseUrl)

  })

  it('Login successfull, verify admin account details', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: userAdmin,
    }).as('loginSuccess')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type(`${userAdmin.email}`)
    cy.get('input[formControlName=password]').type(`${userAdmin.password}`)

    cy.get('button[type="submit"]').contains('Submit').should('not.be.disabled');
    cy.get('button[type="submit"]').contains('Submit').click();

    cy.wait('@loginSuccess')
    cy.wait('@session')

    cy.url().should('include', '/sessions')
    cy.get('.error').should('not.exist')

    cy.intercept('GET', `/api/user/${userAdmin.id}`, {
      statusCode: 200,
      body: userAdmin,
    }).as('getMe')

    cy.get('span[routerLink=me]').click()
    cy.wait('@getMe')

    cy.url().should('eq', Cypress.config().baseUrl + 'me')

    cy.contains(`${userAdmin.firstName} ${userAdmin.lastName.toUpperCase()}`).should('be.visible');
    cy.contains(`${userAdmin.email}`).should('be.visible');
    cy.contains('You are admin').should('be.visible');
    cy.get('button span mat-icon').contains('delete').should('not.exist');
  })

  it('Login successfull, verify not admin account details and delete it', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: user
    }).as('loginSuccess')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type(`${user.email}`)
    cy.get('input[formControlName=password]').type(`${user.password}`)

    cy.get('button[type="submit"]').contains('Submit').should('not.be.disabled');
    cy.get('button[type="submit"]').contains('Submit').click();

    cy.wait('@loginSuccess')
    cy.wait('@session')

    cy.url().should('eq', Cypress.config().baseUrl + 'sessions')
    cy.get('.error').should('not.exist')

    cy.intercept('GET', `/api/user/${user.id}`, {
      statusCode: 200,
      body: user,
    }).as('getMe')

    cy.get('span[routerLink=me]').click()
    cy.wait('@getMe')

    cy.url().should('eq', Cypress.config().baseUrl + 'me')

    cy.contains(`${user.firstName} ${user.lastName.toUpperCase()}`).should('be.visible');
    cy.contains(`${user.email}`).should('be.visible');
    cy.get('button span mat-icon').contains('delete').should('exist');
    cy.contains('You are admin').should('not.exist');


    cy.intercept('DELETE', `/api/user/${user.id}`, {
      statusCode: 200,
      body: user
    }).as('deleteSuccess')

    cy.get('button[mat-raised-button][color="warn"]').contains('delete').should('be.visible');
    cy.get('button[mat-raised-button][color="warn"]').click();
    cy.wait('@deleteSuccess');

    cy.url().should('eq', Cypress.config().baseUrl)
    cy.get('snack-bar-container').contains('Your account has been deleted !').should('exist');

  })

  it('should redirect to /login if user is not logged in', () => {

    cy.intercept('GET', '/api/session', { body: { isLogged: false } }).as('sessionCheck');

    cy.visit('/sessions');

    // Vérifie que l'utilisateur est bien redirigé vers /login
    cy.url().should('eq', Cypress.config().baseUrl + 'login');
  });

});
