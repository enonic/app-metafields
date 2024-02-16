import {
	describe,
	expect,
	test as it,
} from '@jest/globals';
import {oneOrMoreCommaStringToArray} from '/lib/app-metafields/string/oneOrMoreCommaStringToArray';

// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
globalThis.log = {
	error: console.error,
	warning: console.warn,
	info: console.info,
	debug: console.debug,
}

describe('oneOrMoreCommaStringToArray', () => {
	it('should return an empty array for undefined', () => {
		expect(oneOrMoreCommaStringToArray(undefined)).toEqual([]);
	});
	it('should return an empty array for null', () => {
		expect(oneOrMoreCommaStringToArray(null)).toEqual([]);
	});
	it('should return an empty array for empty string', () => {
		expect(oneOrMoreCommaStringToArray('')).toEqual([]);
	});
	it('should return an array for string', () => {
		expect(oneOrMoreCommaStringToArray('string')).toEqual(['string']);
	});
	it("should return an array for ['string0','string1']", () => {
		expect(oneOrMoreCommaStringToArray(['string0','string1'])).toEqual(['string0','string1']);
	});
	it("should return an array for ['string0,string1','string2,string3']", () => {
		expect(oneOrMoreCommaStringToArray(['string0,string1','string2,string3'])).toEqual(['string0','string1','string2','string3']);
	});
});
