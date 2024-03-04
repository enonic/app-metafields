import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


interface GetAppendixParams {
	mergedConfig: MetafieldsSiteConfig
	isFrontpage?: boolean
	site: Site<MetafieldsSiteConfig>
}


// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = ({
	mergedConfig,
	isFrontpage,
	site,
}: GetAppendixParams): string => {
	if (mergedConfig.titleBehaviour || !mergedConfig.hasOwnProperty("titleBehaviour")) {
		const separator = mergedConfig.titleSeparator || '-';
		const titleRemoveOnFrontpage = mergedConfig.hasOwnProperty("titleFrontpageBehaviour")
			? mergedConfig.titleFrontpageBehaviour
			: true; // Default true needs to be respected
		if (!isFrontpage || !titleRemoveOnFrontpage) {
			return ` ${separator} ${site.displayName}`;
		}
	}

	return '';
};
