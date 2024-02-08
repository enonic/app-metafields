import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {getSiteConfig as libPortalGetSiteConfig} from '/lib/xp/portal';
import {getSiteConfigFromSite} from './getSiteConfigFromSite';


// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getTheConfig = ({
	applicationConfig,
	applicationKey,
	site,
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	site: Site<MetafieldsSiteConfig>
}) => {
	let config = libPortalGetSiteConfig<MetafieldsSiteConfig>();
	if (!config) {
		config = getSiteConfigFromSite({
			applicationKey,
			site,
		});
	}
	if (applicationConfig && !config.disableAppConfig) {
		for (let prop in applicationConfig) {
			let value: string|boolean = applicationConfig[prop];
			if (prop !== 'config.filename' && prop !== 'service.pid') { // Default props for .cfg-files, not to use further.
				if (value === 'true' || value === 'false') {
					value = value === 'true';
				}
				(config as Record<typeof prop, typeof value>)[prop] = value;
			}
		}
	}
	return config;
};
