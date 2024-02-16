import type {CommaSeparatedString} from '/lib/app-metafields/types';


import {forceArray} from '@enonic/js-utils/array/forceArray';


export function oneOrMoreCommaStringToArray(
	oneOrMoreCommaString: CommaSeparatedString|CommaSeparatedString[]
): string[] {
	const commaStringArray = forceArray(oneOrMoreCommaString || []);
	const stringArray: string[] = [];
	for (let i = 0; i < commaStringArray.length; i++) {
		const commaString = commaStringArray[i];
		const strArray = commaString.split(',');
		for (let j = 0; j < strArray.length; j++) {
			const str = strArray[j];
			stringArray.push(str.trim());
		} // for strArray
	} // for commaStringArray
	return stringArray;
}
