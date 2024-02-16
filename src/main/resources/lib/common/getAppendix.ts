import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


interface GetAppendixParams {
	appOrSiteConfig: MetafieldsSiteConfig
	isFrontpage?: boolean
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = ({
	appOrSiteConfig,
	isFrontpage,
	siteOrNull,
}: GetAppendixParams): string => {
	if (!siteOrNull) {
		return '';
	}

	if (appOrSiteConfig.titleBehaviour || !appOrSiteConfig.hasOwnProperty("titleBehaviour")) {
		const separator = appOrSiteConfig.titleSeparator || '-';
		const titleRemoveOnFrontpage = appOrSiteConfig.hasOwnProperty("titleFrontpageBehaviour")
			? appOrSiteConfig.titleFrontpageBehaviour
			: true; // Default true needs to be respected
		if (!isFrontpage || !titleRemoveOnFrontpage) {
			return ` ${separator} ${siteOrNull.displayName}`;
		}
	}

	return '';
};
