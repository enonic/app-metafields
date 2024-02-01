import type {Site} from '/lib/xp/portal';
import type { MetafieldsSiteConfig } from '/lib/common/MetafieldsSiteConfig.d';


import {forceArray} from '@enonic/js-utils/array/forceArray';


// Find the site config even when the context is not known.
export const getSiteConfig = (site: Site<MetafieldsSiteConfig>, applicationKey: string) => {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	if (site) {
		if (site.data) {
			if (site.data.siteConfig) {
				var siteConfigs = forceArray(site.data.siteConfig);
				let siteConfig: Partial<typeof siteConfigs[0]> = {};
				siteConfigs.forEach((cfg) => {
					if (applicationKey && cfg.applicationKey == applicationKey) {
						siteConfig = cfg;
					} else if (!applicationKey && cfg.applicationKey == app.name) {
						siteConfig = cfg;
					}
				});
				return siteConfig.config;
			}
		}
	}
};
