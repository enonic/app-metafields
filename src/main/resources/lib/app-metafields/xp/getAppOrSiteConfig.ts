import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {isSet} from '@enonic/js-utils/value/isSet';
import {isString} from '@enonic/js-utils/value/isString';
// import {toStr} from '@enonic/js-utils/value/toStr';
import {getSiteConfig as libPortalGetSiteConfig} from '/lib/xp/portal';
import {getSiteConfigFromSite} from '/lib/common/getSiteConfigFromSite';
import {trimQuotes} from '/lib/app-metafields/string/trimQuotes';


interface GetTheConfigParams {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getAppOrSiteConfig = ({
	applicationConfig,
	applicationKey,
	siteOrNull,
}: GetTheConfigParams): MetafieldsSiteConfig => {
	let appOrSiteConfig: MetafieldsSiteConfig = {}

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
				(appOrSiteConfig as Record<typeof prop, typeof value>)[prop] = value;
			}
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
		return appOrSiteConfig;
	}

	for (let key in siteConfig) {
		const value = siteConfig[key as keyof typeof siteConfig];
		if (isSet(value)) {
			(appOrSiteConfig as Record<typeof key, typeof value>)[key] = value;
		}
	}

	// log.info('config:%s', toStr(config));
	return appOrSiteConfig;
};
