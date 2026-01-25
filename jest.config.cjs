module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
	transformIgnorePatterns: ["node_modules/(?!.*\\.css$)"],
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/tests/__mocks__/fileMock.js",
	},
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: {
					jsx: "react-jsx",
					esModuleInterop: true,
				},
			},
		],
		"^.+\\.(js|jsx)$": ["babel-jest", { configFile: "./babel.config.cjs" }],
		".+\\.(css|less|scss|sass)$":
			"<rootDir>/src/tests/__mocks__/cssTransform.cjs",
	},
	globals: {
		"import.meta": {
			env: {
				PROD: false,
				VITE_API_URL: "http://localhost:3001/api",
			},
		},
	},
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	collectCoverageFrom: [
		"src/**/*.{js,jsx,ts,tsx}",
		"!src/main.tsx",
		"!src/**/*.test.{js,jsx,ts,tsx}",
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
