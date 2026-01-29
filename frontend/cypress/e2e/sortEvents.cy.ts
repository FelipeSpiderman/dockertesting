describe("T02 Events alphabetisch sortieren", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").click();
    cy.get("#email").type("user@example.com");
    cy.get("#password").type("1234");
    cy.get('#root button[type="submit"]').click();
    cy.get("#root div.css-1sry562 button").click();
    cy.get("#root button.btn-secondary").click();
    cy.get("#root select:nth-child(2)").select("endDateTime");
    cy.get("#root select:nth-child(1)").select("CONFERENCE");
    cy.get("#root select:nth-child(1)").select("WORKSHOP");
    cy.get("#root input.search-input").click();
    cy.get("#root input.search-input").type("client{enter}");
  });
});
