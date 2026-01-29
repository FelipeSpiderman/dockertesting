describe("Event erstellen (T05)", { testIsolation: false }, () => {
  it("passes", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#email").click();
    cy.get("#email").type("admin@example.com");
    cy.get("#password").type("1234");
    cy.get('#root button[type="submit"]').click();
    cy.get("#root div.css-1sry562 button").click();
    cy.contains("Neues Event erstellen").click();
    cy.get("#root div.form-container > div:nth-child(2) > input").click();
    cy.get("#root div.form-container > div:nth-child(2) > input").type("test");
    cy.get("#root div:nth-child(4) select").select("WORKSHOP");
    cy.get("#root textarea").click();
    cy.get("#root textarea").type("test");
    cy.get('#root input[type="text"][required=""]').click();
    cy.get("#root div.modal-actions button.btn-primary").click();
    cy.get("#root div.error-popup-footer button.btn").click();
    cy.get("#root div.form-row div:nth-child(1) input").click();
    cy.get('#root input[type="datetime-local"][value=""]')
      .first()
      .type("2017-06-01T08:30");
    cy.get('#root input[type="datetime-local"][value=""]')
      .first()
      .type("2017-06-01T09:00");
    cy.get("#root div.modal-actions button.btn-primary").click();
    cy.get("#root div.error-popup-footer button.btn").click();
    cy.get('#root input[type="text"][required=""]').click();
    cy.get('#root input[type="text"][required=""]').type("test");
    cy.get("#root div.modal-actions button.btn-primary").click();
    cy.get("#root header.app-header button.btn").click();
  });
});
