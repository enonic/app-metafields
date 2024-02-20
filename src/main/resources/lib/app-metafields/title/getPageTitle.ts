import type {Content} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {toStr} from '@enonic/js-utils/value/toStr';
import {oneOrMoreCommaStringToArray} from '/lib/app-metafields/string/oneOrMoreCommaStringToArray';
import {APP_NAME_PATH, DEBUG, MIXIN_PATH} from '/lib/app-metafields/constants';
import {findStringValueInObject} from '/lib/app-metafields/object/findStringValueInObject';
import {stringOrNull} from '/lib/app-metafields/string/stringOrNull';


interface GetPageTitleParams {
	siteOrProjectOrAppConfig: MetafieldsSiteConfig
	content: Content
}


export const getPageTitle = ({
	siteOrProjectOrAppConfig,
	content,
}: GetPageTitleParams): string => {
	DEBUG && log.debug('getPageTitle siteOrProjectOrAppConfig:%s content:%s', toStr(siteOrProjectOrAppConfig), toStr(content));

	const userDefinedPaths = siteOrProjectOrAppConfig.pathsTitles || '';
	DEBUG && log.debug('getPageTitle userDefinedPaths: %s', userDefinedPaths);

	const userDefinedArray = userDefinedPaths ? oneOrMoreCommaStringToArray(userDefinedPaths) : [];
	DEBUG && log.debug('getPageTitle userDefinedArray: %s', toStr(userDefinedArray));

	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteOrProjectOrAppConfig.fullPath) : null;
	DEBUG && log.debug('getPageTitle userDefinedValue: %s', userDefinedValue);

	return content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoTitle as string
		|| stringOrNull(userDefinedValue) // json property defined by user as important
		|| stringOrNull(content.displayName) // Use content's display name
};
