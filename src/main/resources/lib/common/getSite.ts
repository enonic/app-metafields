import type {Site} from '/lib/xp/portal';
import type { MetafieldsSiteConfig } from '/lib/common/MetafieldsSiteConfig.d';


import {query} from '/lib/xp/content';


export const getSite = (siteUrl: string) => {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	const sitesResult = query<Site<MetafieldsSiteConfig>>({
		query: "_path LIKE '/content/*' AND _name LIKE '" + siteUrl + "' AND data.siteConfig.applicationKey = '" + app.name + "'",
		contentTypes: ["portal:site"]
	});
	return sitesResult.hits[0];
}
