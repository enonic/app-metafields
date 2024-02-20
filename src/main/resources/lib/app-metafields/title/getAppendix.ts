import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


interface GetAppendixParams {
	siteOrProjectOrAppConfig: MetafieldsSiteConfig
	isFrontpage?: boolean
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = ({
	siteOrProjectOrAppConfig,
	isFrontpage,
	siteOrNull,
}: GetAppendixParams): string => {
	if (!siteOrNull) {
		return '';
	}

	if (siteOrProjectOrAppConfig.titleBehaviour || !siteOrProjectOrAppConfig.hasOwnProperty("titleBehaviour")) {
		const separator = siteOrProjectOrAppConfig.titleSeparator || '-';
		const titleRemoveOnFrontpage = siteOrProjectOrAppConfig.hasOwnProperty("titleFrontpageBehaviour")
			? siteOrProjectOrAppConfig.titleFrontpageBehaviour
			: true; // Default true needs to be respected
		if (!isFrontpage || !titleRemoveOnFrontpage) {
			return ` ${separator} ${siteOrNull.displayName}`;
		}
	}

	return '';
};
