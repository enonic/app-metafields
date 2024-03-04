import type {Content, Site} from '/lib/xp/content';
import type {ImageId} from '/lib/app-metafields/types';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {DEBUG} from '/lib/app-metafields/constants';
import {findImageIdInContent} from '/lib/app-metafields/image/findImageIdInContent';


interface GetImageUrlParams {
	mergedConfig: MetafieldsSiteConfig
	content: Content
	site: Site<MetafieldsSiteConfig>
}


export function getImageId({
	mergedConfig,
	content,
	site,
}: GetImageUrlParams): ImageId|undefined {
	// 1. Try to find an image within the content isself
	const imageId = findImageIdInContent({
		mergedConfig,
		content,
	});
	if (imageId) {
		return imageId;
	}
	DEBUG && log.debug(`getImageId: Didn't find any image on content ${content._path}`);

	// 2. Fallback to mergedConfig image
	if (mergedConfig.seoImage) { // Empty string is falsy 👍
		return mergedConfig.seoImage as ImageId;
	}
	DEBUG && log.debug(`getImageId: Not even an override image on content ${content._path}`);

	// 3. Fallback to image on siteContent
	if (content._id === site._id) {
		return undefined; // Avoid doing the same thing twice :)
	}

	DEBUG && log.debug(`getImageId ${content._path} !== ${site._path}`);
	return findImageIdInContent({
		mergedConfig,
		content: site,
	});
}
