/// <reference types="cypress" />

// Exemple de test E2E senzill amb Cypress

describe("Home Page", () => {
  it("carrega la pàgina principal i mostra el títol", () => {
    cy.visit("/");
    cy.contains("Iniciar Sessió"); // Comprova que el formulari de login es mostra
    cy.get('img[alt="Boletus"]'); // Comprova que el logo de boletus es mostra (canvia l'alt si cal)
  });
});
