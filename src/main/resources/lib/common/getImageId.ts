import type {Content, Site} from '/lib/xp/content';
import type {ImageId} from '/lib/types';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findImageIdInContent} from '/lib/common/findImageIdInContent';
import {ImageIdBuilder} from '/lib/types';


export function getImageId({
	content,
	site,
	siteConfig
} :{
	content: Content
	site: Site<MetafieldsSiteConfig>
	siteConfig: MetafieldsSiteConfig
}): ImageId|undefined {
	// 1. Override image set on content
	if(content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoImage) {
		return ImageIdBuilder.from(content.x[APP_NAME_PATH][MIXIN_PATH].seoImage as string);
	}

	// 2. Try to find an image within the content isself
	const imageId = findImageIdInContent({content, siteConfig});
	if (imageId) {
		return imageId;
	}

	// 3. Fallback to siteConfig image
	if (siteConfig.seoImage) {
		return ImageIdBuilder.from(siteConfig.seoImage);
	}

	// 4. Fallback to image on siteContent
	return findImageIdInContent({content: site, siteConfig})
}
