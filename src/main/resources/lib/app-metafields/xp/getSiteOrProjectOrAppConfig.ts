import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {isSet} from '@enonic/js-utils/value/isSet';
import {isString} from '@enonic/js-utils/value/isString';
import {toStr} from '@enonic/js-utils/value/toStr';
import {getSiteConfig as libPortalGetSiteConfig} from '/lib/xp/portal';

import {DEBUG} from '/lib/app-metafields/constants';
import {getProjectConfig} from '/lib/app-metafields/project/getProjectConfig';
import {trimQuotes} from '/lib/app-metafields/string/trimQuotes';
import {getSiteConfigFromSite} from '/lib/app-metafields/xp/getSiteConfigFromSite';


interface GetTheConfigParams {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getSiteOrProjectOrAppConfig = ({
	applicationConfig,
	applicationKey,
	siteOrNull,
}: GetTheConfigParams): MetafieldsSiteConfig => {
	let siteOrProjectOrAppConfig: MetafieldsSiteConfig = {}

	if (applicationConfig) {
		// log.info('applicationConfig:%s', toStr(applicationConfig));
		for (let prop in applicationConfig) {
			let value: string|boolean = applicationConfig[prop];
			if (prop !== 'config.filename' && prop !== 'service.pid') { // Default props for .cfg-files, not to use further.
				if (value === 'true' || value === 'false') {
					value = value === 'true';
				}
				if (isString(value)) {
					value = trimQuotes(value);
				}
				(siteOrProjectOrAppConfig as Record<typeof prop, typeof value>)[prop] = value;
			}
		}
	}

	const projectConfig = getProjectConfig();
	for (let key in projectConfig) {
		const value = projectConfig[key as keyof typeof projectConfig];
		if (isSet(value)) {
			(siteOrProjectOrAppConfig as Record<typeof key, typeof value>)[key] = value;
		}
	}

	let siteConfig = libPortalGetSiteConfig<MetafieldsSiteConfig>();
	if (!siteConfig && siteOrNull) {
		siteConfig = getSiteConfigFromSite({
			applicationKey,
			site: siteOrNull,
		});
	}
	// log.info('siteConfig:%s', toStr(siteConfig));


	// NOTE: app-metafields can be added directly to a project, outside of a site
	if (!siteConfig) {
		DEBUG && log.debug('getSiteOrProjectOrAppConfig siteOrProjectOrAppConfig1:%s', toStr(siteOrProjectOrAppConfig));
		return siteOrProjectOrAppConfig;
	}

	for (let key in siteConfig) {
		const value = siteConfig[key as keyof typeof siteConfig];
		if (isSet(value)) {
			(siteOrProjectOrAppConfig as Record<typeof key, typeof value>)[key] = value;
		}
	}

	DEBUG && log.debug('getSiteOrProjectOrAppConfig siteOrProjectOrAppConfig2:%s', toStr(siteOrProjectOrAppConfig));
	return siteOrProjectOrAppConfig;
};
