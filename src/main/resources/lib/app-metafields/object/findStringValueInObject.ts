import {toStr} from '@enonic/js-utils/value/toStr';
import {DEBUG} from '/lib/app-metafields/constants';
import {isString} from '/lib/app-metafields/string/isString';


export function findStringValueInObject(
	object: Record<string, any>,
	paths: string[],
	fullPath: boolean
): string|null {
	DEBUG && log.debug('findStringValueInObject object:%s paths:%s fullPath:%s', toStr(object), toStr(paths), fullPath);

	const pathLength = paths.length;
	let value: string|null = null;
	let jsonPath: string;

	for (let i = 0; i < pathLength; i++) {
		if (paths[i]) {
			jsonPath = (fullPath)
				? 'object["' + paths[i].split('.').join('"]["') + '"]'
				: 'object.data["' + paths[i].split('.').join('"]["') + '"]'; // Wrap property so we can have dashes in it
			// log.info('jsonPath: %s', jsonPath);
			try {
				value = eval(jsonPath); // https://esbuild.github.io/link/direct-eval
				// value = (0, eval)(jsonPath); // This doesn't work!
			} catch (e) {
				// Noop
			}
			if (value) {
				if (!isString(value) || value.trim() === "")
					value = null; // Reset value if empty string (skip empties)
				else
					break; // Expect the first property in the string is the most important one to use
			} // if value
		} // if paths[i]
	} // for
	return value || null; // Convert undefined to null
}
