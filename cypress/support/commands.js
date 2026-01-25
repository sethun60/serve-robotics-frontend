// ***********************************************
// Custom commands and overwrite existing commands
// ***********************************************

Cypress.Commands.add("tab", { prevSubject: "optional" }, (subject) => {
	cy.wrap(subject).trigger("keydown", { keyCode: 9, which: 9, key: "Tab" });
});
