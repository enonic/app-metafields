import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig.d';


import {getAppendix} from '/lib/common/getAppendix';
import {getPageTitle} from '/lib/common/getPageTitle';


export function getTitle({
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

	const isFrontpage = site._path === content._path;
	const titleAppendix = getAppendix({
		applicationConfig,
		applicationKey,
		isFrontpage,
		site,
	});
	const pageTitle = getPageTitle({
		applicationConfig,
		applicationKey,
		content,
		site
	});
	const titleHtml = "<title>" + pageTitle + titleAppendix + "</title>";

	return titleHtml;
}
