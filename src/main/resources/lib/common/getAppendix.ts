import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig.d';


import {getTheConfig} from '/lib/common/getTheConfig';


// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = ({
	applicationConfig, // Avoid app.config so it can be used in Guillotine Extension Context
	applicationKey, // Avoid app.name so it can be used in Guillotine Extension Context
	isFrontpage,
	site,
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	isFrontpage?: boolean
	site: Site<MetafieldsSiteConfig>
}) => {
	const siteConfig = getTheConfig({
		applicationConfig,
		applicationKey,
		site
	});
	let titleAppendix = '';
	if (siteConfig.titleBehaviour || !siteConfig.hasOwnProperty("titleBehaviour")) {
		var separator = siteConfig.titleSeparator || '-';
		var titleRemoveOnFrontpage = siteConfig.hasOwnProperty("titleFrontpageBehaviour") ? siteConfig.titleFrontpageBehaviour : true; // Default true needs to be respected
		if (!isFrontpage || !titleRemoveOnFrontpage) {
			titleAppendix = ' ' + separator + ' ' + site.displayName;
		}
	}
	return titleAppendix;
};