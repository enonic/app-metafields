import type {Content} from '/lib/xp/content';
import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


import {commaStringToArray} from '/lib/common/commaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {getTheConfig} from '/lib/common/getTheConfig';
import {stringOrNull} from '/lib/common/stringOrNull';


export const getPageTitle = ({
	applicationConfig,
	applicationKey,
	content,
	site
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	content: Content
	site: Site<MetafieldsSiteConfig>
}) => {
	const siteConfig = getTheConfig({
		applicationConfig,
		applicationKey,
		site
	});
	// log.info('siteConfig: %s', JSON.stringify(siteConfig, null, 4));

	var userDefinedPaths = siteConfig.pathsTitles || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;

	var setWithMixin = content.x[APP_NAME_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH].seoTitle;

	var metaTitle = setWithMixin ? stringOrNull(content.x[APP_NAME_PATH][MIXIN_PATH].seoTitle) // Get from mixin
		: stringOrNull(userDefinedValue) // json property defined by user as important
		|| stringOrNull(content.data.title) || stringOrNull(content.data.heading) || stringOrNull(content.data.header) // Use other typical content titles (overrides displayName)
		|| stringOrNull(content.displayName) // Use content's display name
		|| stringOrNull(siteConfig.seoTitle) // Use default og-title for site
		|| stringOrNull(site.displayName) // Use site default
		|| ''

	return metaTitle;
};
