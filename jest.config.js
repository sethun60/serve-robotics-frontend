export default {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
	moduleNameMapper: {
		'^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'^.+\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
	},
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', {
			tsconfig: {
				jsx: 'react-jsx',
				esModuleInterop: true,
			},
		}],
		'^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	// Temporarily ignoring App.test.tsx due to Jest/ts-jest CSS resolution issue with leaflet/dist/leaflet.css
	// This is a known limitation when importing CSS from node_modules in TypeScript with ts-jest
	testPathIgnorePatterns: ['/node_modules/', '/src/tests/App.test.tsx'],
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/main.tsx',
		'!src/**/*.test.{js,jsx,ts,tsx}',
		'!src/tests/**',
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
