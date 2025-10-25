/// <reference types="cypress" />
describe("Simple App Test", () => {
  it("loads the homepage", () => {
    cy.visit("/");
    cy.contains("Boletus"); // Canvia el text segons el que aparegui a la teva home
  });
});
