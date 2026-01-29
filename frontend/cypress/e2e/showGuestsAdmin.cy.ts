describe("T07 Eingeladene Gäste anzeigen", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("#email").type("admin@example.com");
    cy.get("#password").type("1234");
    cy.contains("button", "Sign in").click();
    cy.url().should("include", "/");
  });

  it("zeigt alle eingeladenen Gäste", () => {
    cy.get("#root div.css-1sry562 button").click();
    cy.get("#root div.view-toggle button:nth-child(2)").click();
    cy.get(
      "#root div:nth-child(1) > div.event-actions > button.btn-info",
    ).click();
  });
});
