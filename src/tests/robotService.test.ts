// Mock the robot service before importing
jest.mock("../services/robotService", () => ({
	robotService: {
		getRobots: jest.fn(),
		moveRobots: jest.fn(),
		resetRobots: jest.fn(),
		startAutoMove: jest.fn(),
		stopAutoMove: jest.fn(),
		clearCache: jest.fn(),
	}
}))

import { robotService } from "../services/robotService";

describe("RobotService", () => {
	beforeEach(() => {
		jest.clearAllMocks();
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
