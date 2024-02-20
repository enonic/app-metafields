import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {toStr} from '@enonic/js-utils/value/toStr';
import {DEBUG} from '/lib/app-metafields/constants';
import {getAppendix} from '/lib/app-metafields/title/getAppendix';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';


interface GetFullTitleParams {
	siteOrProjectOrAppConfig: MetafieldsSiteConfig
	content: Content
	siteOrNull: Site<MetafieldsSiteConfig>|null
}

export function getFullTitle({
	siteOrProjectOrAppConfig,
	content,
	siteOrNull,
}: GetFullTitleParams) {
	DEBUG && log.debug('getFullTitle siteOrProjectOrAppConfig:%s content:%s siteOrNull:%s', toStr(siteOrProjectOrAppConfig), toStr(content), toStr(siteOrNull));

	const isFrontpage = siteOrNull?._path === content._path;
	const titleAppendix = getAppendix({
		siteOrProjectOrAppConfig,
		isFrontpage,
		siteOrNull,
	});
	const pageTitle = getPageTitle({
		siteOrProjectOrAppConfig,
		content
	});
	return `${pageTitle}${titleAppendix}`;
}
