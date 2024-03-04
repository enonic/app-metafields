import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {isSet} from '@enonic/js-utils/value/isSet';
import {isString} from '@enonic/js-utils/value/isString';
import {toStr} from '@enonic/js-utils/value/toStr';
import {DEBUG} from '/lib/app-metafields/constants';
import {trimQuotes} from '/lib/app-metafields/string/trimQuotes';


interface GetTheConfigParams {
	siteConfig: MetafieldsSiteConfig
}


// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getMergedConfig = ({
	siteConfig,
}: GetTheConfigParams): MetafieldsSiteConfig => {
	let mergedConfig: MetafieldsSiteConfig = {}

	if (app.config) {
		DEBUG && log.debug('getMergedConfig app.config:%s', toStr(app.config));
		for (let prop in app.config) {
			let value: string|boolean = app.config[prop];
			if (prop !== 'config.filename' && prop !== 'service.pid') { // Default props for .cfg-files, not to use further.
				if (value === 'true' || value === 'false') {
					value = value === 'true';
				}
				if (isString(value)) {
					value = trimQuotes(value);
				}
				(mergedConfig as Record<typeof prop, typeof value>)[prop] = value;
			}
		}
	}

	for (let key in siteConfig) {
		const value = siteConfig[key as keyof typeof siteConfig];
		if (isSet(value)) {
			(mergedConfig as Record<typeof key, typeof value>)[key] = value;
		}
	}

	DEBUG && log.debug('getMergedConfig mergedConfig:%s', toStr(mergedConfig));
	return mergedConfig;
};
