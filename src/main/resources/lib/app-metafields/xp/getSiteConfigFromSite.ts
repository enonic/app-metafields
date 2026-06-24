import type {Site} from '@enonic-types/lib-content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {forceArray} from '@enonic/js-utils/array/forceArray';


export const getSiteConfigFromSite = (site: Site<MetafieldsSiteConfig>): MetafieldsSiteConfig|null => {
	const siteConfig = forceArray(site.data?.siteConfig)
		.filter(sc => sc && sc.applicationKey === app.name)[0];
	return siteConfig ? siteConfig.config : null;
};
