import "@testing-library/jest-dom";

// Suppress React 18 act() warnings for async state updates in tests
// These warnings are false positives when using @testing-library with async operations
const originalError = console.error;
beforeAll(() => {
	console.error = (...args) => {
		if (
			typeof args[0] === "string" &&
			args[0].includes("Warning: An update to") &&
			args[0].includes("was not wrapped in act")
		) {
			return;
		}
		originalError.call(console, ...args);
	};
});

afterAll(() => {
	console.error = originalError;
});

// Mock import.meta
global.importMeta = { env: { VITE_API_URL: "http://localhost:3001/api" } };

// Mock Leaflet
jest.mock("leaflet", () => ({
	divIcon: jest.fn(() => ({})),
	icon: jest.fn(() => ({})),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
	constructor() {}
	disconnect() {}
	observe() {}
	unobserve() {}
	takeRecords() {
		return [];
	}
};
