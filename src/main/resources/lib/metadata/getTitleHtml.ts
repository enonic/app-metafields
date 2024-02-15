import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {getFullTitle} from '/lib/common/getFullTitle';


interface GetTitleHtmlParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content?: Content
	site: Site<MetafieldsSiteConfig>
}

export function getTitleHtml({
	appOrSiteConfig,
	content=undefined,
	site,
}: GetTitleHtmlParams) {
	if (!content) {
		return undefined;
	}

	return `<title>${getFullTitle({
		appOrSiteConfig,
		content,
		site
	})}</title>`;
}
