import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


import {forceArray} from '@enonic/js-utils/array/forceArray';


// Find the site config even when the context is not known.
export const getSiteConfigFromSite = ({
	applicationKey, // Avoid app.name so it can be used in Guillotine Extension Context
	site
}: {
	applicationKey: string
	site: Site<MetafieldsSiteConfig>,
}
) => {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	if (site) {
		if (site.data) {
			if (site.data.siteConfig) {
				var siteConfigs = forceArray(site.data.siteConfig);
				let siteConfig: Partial<typeof siteConfigs[0]> = {};
				siteConfigs.forEach((cfg) => {
					if (cfg.applicationKey == applicationKey) {
						siteConfig = cfg;
					}
				});
				return siteConfig.config;
			}
		}
	}
};
