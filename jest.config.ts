export default {
	collectCoverageFrom: [
		'src/main/resources/**/*.{ts,tsx}',
		// '!src/**/*.d.ts',
	],
	coverageProvider: 'v8',
	globals: {
		app: {
			name: 'com.enonic.app.metafields',
			config: {}
		}
	},
	moduleNameMapper: {
		'/guillotine/(.*)': '<rootDir>/src/main/resources/guillotine/$1',
		'/lib/app-metafields/(.*)': '<rootDir>/src/main/resources/lib/app-metafields/$1',
		'/cms/(.*)': '<rootDir>/src/main/resources/cms/$1',
	},
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/test/**/*.(spec|test).{ts,tsx}'
	],
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': '@swc/jest'
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(@enonic-types/guillotine)/)'
	],
}
