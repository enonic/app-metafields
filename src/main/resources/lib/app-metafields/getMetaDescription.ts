import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {oneOrMoreCommaStringToArray} from '/lib/app-metafields/string/oneOrMoreCommaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/app-metafields/constants';
import {findStringValueInObject} from '/lib/app-metafields/object/findStringValueInObject';


interface GetMetaDescriptionParams {
	siteOrProjectOrAppConfig: MetafieldsSiteConfig
	content: Content
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


export const getMetaDescription = ({
	siteOrProjectOrAppConfig,
	content,
	siteOrNull,
}: GetMetaDescriptionParams): string => {
	const userDefinedPaths = siteOrProjectOrAppConfig.pathsDescriptions || '';
	const userDefinedArray = userDefinedPaths ? oneOrMoreCommaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteOrProjectOrAppConfig.fullPath) : null;

	const setWithMixin = content.x[APP_NAME_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription;

	let metaDescription = (
		setWithMixin ? content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription // Get from mixin
			: userDefinedValue
			|| siteOrProjectOrAppConfig.seoDescription // Use default for site
			|| siteOrNull?.data.description // Use site description
			|| '' // Don't crash plugin on clean installs
	) as string;

	// Strip away all html tags, in case there's any in the description.
	const regex = /(<([^>]+)>)/ig;
	metaDescription = metaDescription.replace(regex, "");

	return metaDescription;
};
