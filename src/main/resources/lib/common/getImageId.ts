import type {Content, Site} from '/lib/xp/content';
import type {ImageId} from '/lib/types';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


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
	// 1. Try to find an image within the content isself
	const imageId = findImageIdInContent({
		content,
		siteConfig
	});
	if (imageId) {
		return imageId;
	}
	// log.info(`getImageId: Didn't find any image on content ${content._path}`);

	// 2. Fallback to siteConfig image
	if (siteConfig.seoImage) {
		return ImageIdBuilder.from(siteConfig.seoImage);
	}
	// log.info(`getImageId: Not even an override image on content ${content._path}`);

	// 3. Fallback to image on siteContent
	if (content._id === site._id) {
		return undefined; // Avoid doing the same thing twice :)
	}

	// log.info(`getImageId ${content._path} !== ${site._path}`);
	return findImageIdInContent({
		content: site,
		siteConfig
	});
}
