import {getTheConfig} from '/lib/common/getTheConfig';


// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = (site, isFrontpage?: boolean) => {
	const siteConfig = getTheConfig(site);
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
