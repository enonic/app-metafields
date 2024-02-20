import type {Content} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {oneOrMoreCommaStringToArray} from '/lib/app-metafields/string/oneOrMoreCommaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/app-metafields/constants';
import {findStringValueInObject} from '/lib/app-metafields/object/findStringValueInObject';
import {stringOrNull} from '/lib/app-metafields/string/stringOrNull';


interface GetPageTitleParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
}


export const getPageTitle = ({
	appOrSiteConfig,
	content,
}: GetPageTitleParams): string => {
	// log.info('appOrSiteConfig: %s', JSON.stringify(appOrSiteConfig, null, 4));

	const userDefinedPaths = appOrSiteConfig.pathsTitles || '';
	const userDefinedArray = userDefinedPaths ? oneOrMoreCommaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, appOrSiteConfig.fullPath) : null;

	return content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoTitle as string
		|| stringOrNull(userDefinedValue) // json property defined by user as important
		|| stringOrNull(content.displayName) // Use content's display name
};
