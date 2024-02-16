import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {getFullTitle} from '/lib/app-metafields/title/getFullTitle';


interface GetTitleHtmlParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content?: Content
	siteOrNull: Site<MetafieldsSiteConfig>|null
}

export function getTitleHtml({
	appOrSiteConfig,
	content=undefined,
	siteOrNull,
}: GetTitleHtmlParams) {
	if (!content) {
		return undefined;
	}

	return `<title>${getFullTitle({
		appOrSiteConfig,
		content,
		siteOrNull
	})}</title>`;
}
