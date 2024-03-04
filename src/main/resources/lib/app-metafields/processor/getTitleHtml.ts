import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {getFullTitle} from '/lib/app-metafields/title/getFullTitle';


interface GetTitleHtmlParams {
	mergedConfig: MetafieldsSiteConfig
	content?: Content
	site: Site<MetafieldsSiteConfig>
}

export function getTitleHtml({
	mergedConfig,
	content=undefined,
	site,
}: GetTitleHtmlParams) {
	if (!content) {
		return undefined;
	}

	return `<title>${getFullTitle({
		mergedConfig,
		content,
		site,
	})}</title>`;
}
