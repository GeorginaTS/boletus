/// <reference types="cypress" />
describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.get("ion-content").should("exist");
    cy.contains("Iniciar Sessió");
  });
});
