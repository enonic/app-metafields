import type {Site} from '/lib/xp/portal';
import type { MetafieldsSiteConfig } from '/lib/common/MetafieldsSiteConfig.d';


import {getSiteConfig as libPortalGetSiteConfig} from '/lib/xp/portal';
import {getSiteConfig} from '/lib/common/getSiteConfig';


// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getTheConfig = (site: Site<MetafieldsSiteConfig>) => {
	let config = libPortalGetSiteConfig<MetafieldsSiteConfig>();
	if (!config) {
		config = getSiteConfig(site, app.name);
	}
	if (app.config && !config.disableAppConfig) {
		for (let prop in app.config) {
			let value: string|boolean = app.config[prop];
			if (prop !== 'config.filename' && prop !== 'service.pid') { // Default props for .cfg-files, not to use further.
				if (value === 'true' || value === 'false') {
					value = value === 'true';
				}
				config[prop] = value;
			}
		}
	}
	return config;
};
