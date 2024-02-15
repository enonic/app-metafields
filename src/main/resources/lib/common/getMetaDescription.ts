import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {commaStringToArray} from '/lib/common/commaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {CommaSeparatedStringBuilder} from '/lib/types';


interface GetMetaDescriptionParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
	site: Site<MetafieldsSiteConfig>
}


export const getMetaDescription = ({
	appOrSiteConfig,
	content,
	site,
}: GetMetaDescriptionParams): string => {
	const userDefinedPaths = CommaSeparatedStringBuilder.from(appOrSiteConfig.pathsDescriptions || '');
	const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, appOrSiteConfig.fullPath) : null;

	const setWithMixin = content.x[APP_NAME_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription;

	let metaDescription = (
		setWithMixin ? content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription // Get from mixin
			: userDefinedValue
			|| appOrSiteConfig.seoDescription // Use default for site
			|| site.data.description // Use bottom default
			|| '' // Don't crash plugin on clean installs
	) as string;

	// Strip away all html tags, in case there's any in the description.
	const regex = /(<([^>]+)>)/ig;
	metaDescription = metaDescription.replace(regex, "");

	return metaDescription;
};
