import {
	describe,
	expect,
	test as it,
} from '@jest/globals';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';


// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
globalThis.log = {
	error: console.error,
	warning: console.warn,
	info: console.info,
	debug: console.debug,
}

describe('findStringValueInObject', () => {
	it('should return null if no path is given', () => {
		expect(findStringValueInObject({}, [], false)).toBeNull();
		expect(findStringValueInObject({}, [], true)).toBeNull();
	});
	it('should return value for key', () => {
		expect(findStringValueInObject({key: 'value'}, ['key'], false)).toBeNull();
		expect(findStringValueInObject({key: 'value'}, ['key'], true)).toBe('value');
	});
	it('should return value for nested key', () => {
		expect(findStringValueInObject({nested: {key: 'value'}}, ['nested.key'], false)).toBeNull();
		expect(findStringValueInObject({nested: {key: 'value'}}, ['nested.key'], true)).toBe('value');
	});
	it('should handle fullPath true', () => {
		expect(findStringValueInObject({data: {key: 'value'}}, ['key'], false)).toBe('value');
		expect(findStringValueInObject({data: {key: 'value'}}, ['key'], true)).toBeNull();
	});
	it('should return null if value trims to an empty string', () => {
		expect(findStringValueInObject({key: ' '}, ['key'], false)).toBeNull();
		expect(findStringValueInObject({key: ' '}, ['key'], true)).toBeNull();
	});
	it("should skip values that aren't string or that trims to an empty string", () => {
		const object = {
			// bigInt: 0n, // error TS2737: BigInt literals are not available when targeting lower than ES2020.
			date: new Date(),
			emptyArray: [],
			emptyObject: {},
			emptyString: '',
			false: false,
			infinity: Infinity,
			nan: NaN,
			negativeInfinity: -Infinity,
			negativeNumber: -1,
			negativeZero: -0,
			null: null,
			number: 1,
			space: ' ',
			string: 'string',
			true: true,
			undefined: undefined,
			zero: 0
		};
		const paths = [
			// Falsy
			// 'bigInt',
			'emptyString',
			'false',
			'nan',
			'negativeZero',
			'nonExistant',
			'null',
			'undefined',
			'zero',
			// Truthy
			'date',
			'emptyArray',
			'emptyObject',
			'infinity',
			'negativeInfinity',
			'negativeNumber',
			'number',
			'space',
			'true',
			// The only one that should be returned
			'string'
		];
		expect(findStringValueInObject(object, paths, false)).toBeNull();
		expect(findStringValueInObject(object, paths, true)).toBe('string');
	});
});
