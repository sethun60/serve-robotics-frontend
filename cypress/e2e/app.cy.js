describe("Robot Visualization App", () => {
	beforeEach(() => {
		// Intercept API calls
		cy.intercept("GET", "/api/robots", {
			statusCode: 200,
			body: {
				robots: [
					[34.0412, -118.2501],
					[34.0325, -118.2389],
					[34.0298, -118.2456],
				],
			},
		}).as("getRobots");

		cy.visit("/");
	});

	it("loads the application successfully", () => {
		cy.contains("Serve Robotics - DTLA Visualization").should("be.visible");
		cy.wait("@getRobots");
	});

	it("displays the map container", () => {
		cy.get('[aria-label="Robot map visualization"]').should("be.visible");
	});

	it("displays control panel", () => {
		cy.contains("Manual Controls").should("be.visible");
		cy.contains("Backend Auto-Movement").should("be.visible");
		cy.contains("UI Settings").should("be.visible");
	});

	it("can move robots", () => {
		cy.intercept("POST", "/api/move", {
			statusCode: 200,
			body: {
				robots: [
					[34.0413, -118.2502],
					[34.0326, -118.239],
					[34.0299, -118.2457],
				],
			},
		}).as("moveRobots");

		cy.contains("button", "Move Robots").click();
		cy.wait("@moveRobots");
	});

	it("can reset robots", () => {
		cy.intercept("POST", "/api/reset", {
			statusCode: 200,
			body: {
				robots: [
					[34.0412, -118.2501],
					[34.0325, -118.2389],
				],
			},
		}).as("resetRobots");

		cy.get("#reset-count").clear().type("5");
		cy.contains("button", "Reset Robots").click();
		cy.wait("@resetRobots");
	});

	it("can toggle auto-refresh", () => {
		cy.get('input[type="checkbox"]').first().should("be.checked");
		cy.get('input[type="checkbox"]').first().uncheck();
		cy.get('input[type="checkbox"]').first().should("not.be.checked");
	});

	it("displays robot count in status bar", () => {
		cy.wait("@getRobots");
		cy.contains("Robots:").parent().should("contain", "3");
	});

	it("handles API errors gracefully", () => {
		cy.intercept("POST", "/api/move", {
			statusCode: 500,
			body: { message: "Server error" },
		}).as("moveError");

		cy.contains("button", "Move Robots").click();
		cy.wait("@moveError");

		// Error banner should appear
		cy.get('[role="alert"]').should("be.visible");
	});

	it("is keyboard accessible", () => {
		// Tab through controls
		cy.get("body").tab();
		cy.focused().should("have.attr", "id", "move-meters");

		// Continue tabbing
		cy.focused().tab();
		cy.focused().should("contain", "Move Robots");
	});
});
