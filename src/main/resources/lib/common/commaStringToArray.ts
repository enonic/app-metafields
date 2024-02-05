import {forceArray} from '@enonic/js-utils/array/forceArray';


export function commaStringToArray(str: string): string[] {
	const commas = str || '';
	let arr = commas.split(',');
	if (arr) {
		arr = arr.map(function (s) { return s.trim() });
	} else {
		arr = forceArray(str); // Make sure we always work with an array
	}
	return arr;
}
