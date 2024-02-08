import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {getFullTitle} from '/lib/common/getFullTitle';


export function getTitleHtml({
	applicationConfig, // Avoid app.config so it can be used in Guillotine Extension Context
	applicationKey, // Avoid app.name so it can be used in Guillotine Extension Context,
	content=undefined,
	site,
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	content?: Content
	site: Site<MetafieldsSiteConfig>
}) {
	if (!content) {
		return undefined;
	}

	return `<title>${getFullTitle({
		applicationConfig,
		applicationKey,
		content,
		site
	})}</title>`;
}
