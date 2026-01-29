describe("Events anzeigen (T01 / T07)", { testIsolation: false }, () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/login");
    cy.get('#root button[type="button"]').click();
    cy.get(
      "#root div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > p:nth-child(3)",
    ).click();
  });
});
