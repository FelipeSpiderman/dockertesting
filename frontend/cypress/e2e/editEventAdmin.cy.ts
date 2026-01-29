describe("Event erstellen (T06)", { testIsolation: false }, () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").click();
    cy.get("#email").type("admin@example.com");
    cy.get("#password").type("1234");
    cy.get('#root button[type="submit"]').click();
    cy.get("#root div.css-1sry562 button").click();
    cy.get("#root div.view-toggle button:nth-child(2)").click();
    cy.get(
      "#root div:nth-child(3) > div.event-actions > button.btn-secondary",
    ).click();
    cy.get("#root div:nth-child(4) select").select("MEETING");
    cy.get("#root textarea").click();
    cy.get("#root textarea").type(" more details");
    cy.get("#root div.modal-actions button.btn-primary").click();
  });
});
