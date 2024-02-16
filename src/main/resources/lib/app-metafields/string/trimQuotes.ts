import endsWith from '@enonic/js-utils/string/endsWith';
import {startsWith} from '@enonic/js-utils/string/startsWith';


const DOUBLE_QUOTE = '"';
const SINGLE_QUOTE = "'";


export const trimQuotes = (str: string): string => {
	if (
		str.length > 2 // Leave empty quotes '' and "" alone.
		&& (
			(startsWith(str,DOUBLE_QUOTE) && endsWith(str,DOUBLE_QUOTE))
			|| (startsWith(str,SINGLE_QUOTE) && endsWith(str,SINGLE_QUOTE))
		)
	) {
		return str.slice(1, -1);
	}
	return str;
}
