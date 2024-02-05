import type {Content} from '/lib/xp/content';
import type {ImageId} from '/lib/types';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


import {commaStringToArray} from '/lib/common/commaStringToArray';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {ImageIdBuilder} from '/lib/types';


export function findImageIdInContent({
	content,
	siteConfig
}: {
	content: Content
	siteConfig: MetafieldsSiteConfig
}): ImageId|undefined {
	const userDefinedPaths = siteConfig.pathsImages || '';
	const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;
	return ImageIdBuilder.from(
		userDefinedValue
		|| content.data.image as string
		|| content.data.images as string
	) || undefined;
}
