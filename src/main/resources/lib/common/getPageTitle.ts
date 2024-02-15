import type {Content} from '/lib/xp/content';
import type {Site} from '@enonic-types/lib-portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {commaStringToArray} from '/lib/common/commaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {getTheConfig} from '/lib/common/getTheConfig';
import {stringOrNull} from '/lib/common/stringOrNull';
import {CommaSeparatedStringBuilder} from '/lib/types';


interface GetPageTitleParams {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	content: Content
	site: Site<MetafieldsSiteConfig>
}


export const getPageTitle = ({
	applicationConfig,
	applicationKey,
	content,
	site
}: GetPageTitleParams): string => {
	const siteConfig = getTheConfig({
		applicationConfig,
		applicationKey,
		site
	});
	// log.info('siteConfig: %s', JSON.stringify(siteConfig, null, 4));

	const userDefinedPaths = CommaSeparatedStringBuilder.from(siteConfig.pathsTitles || '');
	const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;

	return content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoTitle as string
		|| stringOrNull(userDefinedValue) // json property defined by user as important
		|| stringOrNull(content.displayName) // Use content's display name
};
