import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {isSet} from '@enonic/js-utils/value/isSet';
// import {toStr} from '@enonic/js-utils/value/toStr';
import {getSiteConfig as libPortalGetSiteConfig} from '/lib/xp/portal';
import {getSiteConfigFromSite} from '/lib/common/getSiteConfigFromSite';


interface GetTheConfigParams {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	site: Site<MetafieldsSiteConfig>
}


// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getAppOrSiteConfig = ({
	applicationConfig,
	applicationKey,
	site,
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
				(appOrSiteConfig as Record<typeof prop, typeof value>)[prop] = value;
			}
		}
	}

	let siteConfig = libPortalGetSiteConfig<MetafieldsSiteConfig>();
	if (!siteConfig) {
		siteConfig = getSiteConfigFromSite({
			applicationKey,
			site,
		});
	}

	// log.info('siteConfig:%s', toStr(siteConfig));
	for (let key in siteConfig) {
		const value = siteConfig[key as keyof typeof siteConfig];
		if (isSet(value)) {
			(appOrSiteConfig as Record<typeof key, typeof value>)[key] = value;
		}
	}

	// log.info('config:%s', toStr(config));
	return appOrSiteConfig;
};
