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
		'/site/(.*)': '<rootDir>/src/main/resources/site/$1',
	},
	preset: 'ts-jest/presets/js-with-babel-legacy',
	testEnvironment: 'node',
	testMatch: [
		'<rootDir>/test/**/*.(spec|test).{ts,tsx}'
	],
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: './test/tsconfig.json',
			}
		]
	},
	transformIgnorePatterns: [
		'/node_modules/(?!(@enonic-types/guillotine)/)'
	],
}
