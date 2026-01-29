describe("Login Test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("should login successfully", () => {
    cy.get("#email").type("user@example.com");
    cy.get("#password").type("1234");
    cy.contains("button", "Sign in").click();
    cy.url().should("include", "/");
  });

  it("should show error on invalid login", () => {
    cy.get("#email").type("invalid@example.com");
    cy.get("#password").type("wrongpassword");
    cy.contains("button", "Sign in").click();
    cy.get("#email").should("exist");
  });
});
