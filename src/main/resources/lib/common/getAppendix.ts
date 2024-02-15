import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


interface GetAppendixParams {
	appOrSiteConfig: MetafieldsSiteConfig
	isFrontpage?: boolean
	site: Site<MetafieldsSiteConfig>
}


// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = ({
	appOrSiteConfig,
	isFrontpage,
	site,
}: GetAppendixParams): string => {
	let titleAppendix = '';
	if (appOrSiteConfig.titleBehaviour || !appOrSiteConfig.hasOwnProperty("titleBehaviour")) {
		const separator = appOrSiteConfig.titleSeparator || '-';
		const titleRemoveOnFrontpage = appOrSiteConfig.hasOwnProperty("titleFrontpageBehaviour")
			? appOrSiteConfig.titleFrontpageBehaviour
			: true; // Default true needs to be respected
		if (!isFrontpage || !titleRemoveOnFrontpage) {
			titleAppendix = ' ' + separator + ' ' + site.displayName;
		}
	}
	return titleAppendix;
};
