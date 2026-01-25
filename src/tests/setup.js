import "@testing-library/jest-dom";

// Mock import.meta
global.importMeta = { env: { VITE_API_URL: 'http://localhost:3001/api' } };

// Mock Leaflet
jest.mock('leaflet', () => ({
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
