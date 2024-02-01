import { isString } from '/lib/common/isString';

/**
 * Returns the string value or null.
 *
 * @param o - the value to check
 * @returns the string value or null
 */
export function stringOrNull(o) {
	return isString(o) ? o : null;
}
