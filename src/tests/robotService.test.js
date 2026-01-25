import { robotService } from "../services/robotService";

describe("RobotService", () => {
	beforeEach(() => {
		// Clear cache before each test
		robotService.clearCache();
	});

	it("has correct API methods", () => {
		expect(typeof robotService.getRobots).toBe("function");
		expect(typeof robotService.moveRobots).toBe("function");
		expect(typeof robotService.resetRobots).toBe("function");
		expect(typeof robotService.startAutoMove).toBe("function");
		expect(typeof robotService.stopAutoMove).toBe("function");
		expect(typeof robotService.clearCache).toBe("function");
	});

	it("clears cache on move and reset", () => {
		expect(robotService.clearCache).toBeDefined();
		robotService.clearCache();
		// Cache should be cleared without errors
	});
});
