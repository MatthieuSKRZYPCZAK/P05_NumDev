/// <reference types="cypress" />
import CypressConfig from "../../cypress.config";

describe('Login spec', () => {

  const user = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
    admin: 'true'
  }

  // Page de login avant chaque test
  beforeEach(() => {
    cy.visit('/login')
  });


  it('Login successfull', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: user,
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
    cy.get('.error').should('not.exist')
  })

  it('Login with incorrect password', () => {
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"wrongPass"}{enter}{enter}`)

    cy.get('.error').should('be.visible').and('contain', 'An error occurred')

  })

  it('Login with incorrect email', () => {
    cy.get('input[formControlName=email]').type("wrongMail@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.get('.error').should('be.visible').and('contain', 'An error occurred')
  })

  it('Login with and invalid password format', () => {
    cy.get('input[formControlName=email]').type(`${""}{enter}`)
    cy.get('input[formControlName=password]').type(`${""}{enter}{enter}`)

    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.get('button[type="submit"]').should('be.disabled');
  })

  it('Login with an empty password and email field', () => {
    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.get('input[formControlName=password]').should('have.class', 'ng-invalid')

    cy.get('button[type="submit"]').should('be.disabled');
  })

  it('Toggles password visibility when clicking the visibility button', () => {

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type("password12345")

    cy.get('button[mat-icon-button]').contains('visibility_off').should('exist');
    cy.get('button[mat-icon-button]').contains('visibility').click();
    cy.get('button[mat-icon-button]').contains('visibility').should('exist');
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
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('eq', Cypress.config().baseUrl + 'sessions')
    cy.get('.link').contains('Logout').click()
    cy.get('.error').should('not.exist')
    cy.url().should('eq', Cypress.config().baseUrl)

  })
});
