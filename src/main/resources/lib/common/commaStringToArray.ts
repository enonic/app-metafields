import type {CommaSeparatedString} from '/lib/types';


import {forceArray} from '@enonic/js-utils/array/forceArray';


export function commaStringToArray(str: CommaSeparatedString): string[] {
	const commas: string = str || '';
	let arr = commas.split(',');
	if (arr) {
		arr = arr.map((s) => { return s.trim() });
	} else {
		arr = forceArray(str); // Make sure we always work with an array
	}
	return arr;
}
