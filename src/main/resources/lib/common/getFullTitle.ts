import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {getAppendix} from '/lib/common/getAppendix';
import {getPageTitle} from '/lib/common/getPageTitle';


export function getFullTitle({
	applicationConfig, // Avoid app.config so it can be used in Guillotine Extension Context
	applicationKey, // Avoid app.name so it can be used in Guillotine Extension Context,
	content,
	site,
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	content: Content
	site: Site<MetafieldsSiteConfig>
}) {
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
	return `${pageTitle}${titleAppendix}`;
}
