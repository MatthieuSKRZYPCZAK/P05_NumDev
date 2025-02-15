/// <reference types="cypress" />
import CypressConfig from "../../../cypress.config";

describe('Not Found Page', () => {
  it('should diplay "Page not found !" when navigating to an invalid URL', () => {

    // Visite l'URL qui n'existe pas
    cy.visit('/random-page-that-does-not-exist');

    // Vérifie que l'utilisateur est bien redirigé vers "/404"
    cy.url().should('eq', Cypress.config().baseUrl + '404');

    // Vérifie que la page affiche bien le message "Page not found!"
    cy.contains('h1', 'Page not found !').should('be.visible');
  });
})
