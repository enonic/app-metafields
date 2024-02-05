import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


import {commaStringToArray} from '/lib/common/commaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {getTheConfig} from '/lib/common/getTheConfig';
import {CommaSeparatedStringBuilder} from '/lib/types';


export const getMetaDescription = ({
	applicationConfig,
	applicationKey,
	content,
	site,
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

	const userDefinedPaths = CommaSeparatedStringBuilder.from(siteConfig.pathsDescriptions || '');
	const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;

	const setWithMixin = content.x[APP_NAME_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription;

	let metaDescription = (
		setWithMixin ? content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription // Get from mixin
			: userDefinedValue
			|| content.data.preface || content.data.description || content.data.summary // Use typical content summary names
			|| siteConfig.seoDescription // Use default for site
			|| site.data.description // Use bottom default
			|| '' // Don't crash plugin on clean installs
	) as string;

	// Strip away all html tags, in case there's any in the description.
	const regex = /(<([^>]+)>)/ig;
	metaDescription = metaDescription.replace(regex, "");

	return metaDescription;
};
