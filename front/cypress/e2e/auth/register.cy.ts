/// <reference types="cypress" />

describe('Register spec', () => {

  const newUser = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    password: 'password12345',
  }

  // Page d'enregistrement avant chaque test
  beforeEach(() => {
    cy.visit('/register')
  });

  it('Register successfull', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: newUser
    }).as('registerSuccess')

    cy.get('input[formControlName=firstName]').type('john')
    cy.get('input[formControlName=lastName]').type('doe')
    cy.get('input[formControlName=email]').type('john.doe@example.com')
    cy.get('input[formControlName=password]').type('password12345')

    cy.get('button[type="submit"]').should("not.be.disabled");
    cy.get('.error').should('not.exist')
    cy.get('button[type="submit"]').click();

    cy.wait('@registerSuccess')

    cy.url().should('eq', Cypress.config().baseUrl + 'login')
  });

  it('Register with empty fields', () => {
    cy.get('input[formControlName=firstName]').should('have.class', 'ng-invalid')
    cy.get('input[formControlName=lastName]').should('have.class', 'ng-invalid')
    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.get('input[formControlName=password]').should('have.class', 'ng-invalid')

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Register with an invalid password format', () => {
    cy.get('input[formControlName=firstName]').type('john')
    cy.get('input[formControlName=lastName]').type('doe')
    cy.get('input[formControlName=email]').type('john.doe')
    cy.get('input[formControlName=password]').type('password12345')

    cy.get('input[formControlName=email]').should('have.class', 'ng-invalid')
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Server error during registration', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 500,
      body: {}
    }).as('registerError')

    cy.get('input[formControlName=firstName]').type('john')
    cy.get('input[formControlName=lastName]').type('doe')
    cy.get('input[formControlName=email]').type('john.doe@example.com')
    cy.get('input[formControlName=password]').type('password12345')

    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();

    cy.wait('@registerError')
    cy.get('.error').should('be.visible').and('contain', 'An error occurred')

  });

  it('Registration with too short firstName', () => {
    cy.get('input[formControlName=firstName]').type('jo')
    cy.get('input[formControlName=lastName]').type('doe')
    cy.get('input[formControlName=email]').type('john.doe@example.com')
    cy.get('input[formControlName=password]').type('password12345')

    cy.get('button[type="submit"]').click();
    cy.get('.error').should('be.visible').and('contain', 'An error occurred')
  })

});
