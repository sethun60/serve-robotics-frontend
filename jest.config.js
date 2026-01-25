export default {
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/tests/__mocks__/fileMock.js",
	},
	transform: {
		"^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./babel.config.cjs" }],
	},
	collectCoverageFrom: [
		"src/**/*.{js,jsx}",
		"!src/main.jsx",
		"!src/**/*.test.{js,jsx}",
		"!src/tests/**",
	],
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
	},
};
