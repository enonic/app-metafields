import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {getAppendix} from '/lib/app-metafields/title/getAppendix';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';


interface GetFullTitleParams {
	mergedConfig: MetafieldsSiteConfig
	content: Content
	site: Site<MetafieldsSiteConfig>
}

export function getFullTitle({
	mergedConfig,
	content,
	site,
}: GetFullTitleParams) {
	const isFrontpage = site._path === content._path;
	const titleAppendix = getAppendix({
		mergedConfig,
		isFrontpage,
		site,
	});
	const pageTitle = getPageTitle({
		mergedConfig,
		content
	});
	return `${pageTitle}${titleAppendix}`;
}
