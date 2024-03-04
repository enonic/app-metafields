import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {getSiteConfig as libContentGetSiteConfig} from '/lib/xp/content';


export const getSiteConfigOrNullFromContentKey = (siteKey: string): MetafieldsSiteConfig|null =>
libContentGetSiteConfig<MetafieldsSiteConfig>({
	applicationKey: app.name,
	key: siteKey
});
