import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {getAppendix} from '/lib/common/getAppendix';
import {getPageTitle} from '/lib/common/getPageTitle';


interface GetFullTitleParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
	site: Site<MetafieldsSiteConfig>
}

export function getFullTitle({
	appOrSiteConfig,
	content,
	site,
}: GetFullTitleParams) {
	const isFrontpage = site._path === content._path;
	const titleAppendix = getAppendix({
		appOrSiteConfig,
		isFrontpage,
		site,
	});
	const pageTitle = getPageTitle({
		appOrSiteConfig,
		content
	});
	return `${pageTitle}${titleAppendix}`;
}
