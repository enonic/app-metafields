import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {getAppendix} from '/lib/app-metafields/title/getAppendix';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';


interface GetFullTitleParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
	siteOrNull: Site<MetafieldsSiteConfig>|null
}

export function getFullTitle({
	appOrSiteConfig,
	content,
	siteOrNull,
}: GetFullTitleParams) {
	const isFrontpage = siteOrNull?._path === content._path;
	const titleAppendix = getAppendix({
		appOrSiteConfig,
		isFrontpage,
		siteOrNull,
	});
	const pageTitle = getPageTitle({
		appOrSiteConfig,
		content
	});
	return `${pageTitle}${titleAppendix}`;
}
