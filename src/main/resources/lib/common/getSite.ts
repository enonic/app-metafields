import type {Site} from '/lib/xp/portal';
import type { MetafieldsSiteConfig } from '/lib/types/MetafieldsSiteConfig';


import {query} from '/lib/xp/content';


export const getSite = ({
	applicationKey, // Avoid app.name so it can be used in Guillotine Extension Context
	siteUrl
} : {
	applicationKey: string
	siteUrl: string
}) => {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	const sitesResult = query<Site<MetafieldsSiteConfig>>({
		query: "_path LIKE '/content/*' AND _name LIKE '" + siteUrl + "' AND data.siteConfig.applicationKey = '" + applicationKey + "'",
		contentTypes: ["portal:site"]
	});
	return sitesResult.hits[0];
}
