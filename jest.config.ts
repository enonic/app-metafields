export default {
	collectCoverageFrom: [
		'src/main/resources/**/*.{ts,tsx}',
		// '!src/**/*.d.ts',
	],
	coverageProvider: 'v8',
	moduleNameMapper: {
		'/lib/common/(.*)': '<rootDir>/src/main/resources/lib/common/$1',
		'/lib/metadata/(.*)': '<rootDir>/src/main/resources/lib/metadata/$1',
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
}
