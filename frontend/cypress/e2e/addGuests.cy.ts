describe("Teilnehmer verwalten", { testIsolation: false }, () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").click();
    cy.get("#email").type("admin@example.com");
    cy.get("#password").type("1234");
    cy.get('#root button[type="submit"]').click();
    cy.get("#root div.css-1sry562 button").click();
    cy.get("#root div.view-toggle button:nth-child(2)").click();
    cy.get(
      "#root div:nth-child(1) > div.event-actions > button.btn-info",
    ).click();
    cy.get("#root div:nth-child(2) > select.select-input-small").select(
      "COLLABORATOR",
    );
    cy.get(
      "#root div.add-participant-section div:nth-child(2) button.btn",
    ).click();
  });
});
