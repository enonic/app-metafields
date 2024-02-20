import type {Content, Site} from '/lib/xp/content';
import type {ImageId} from '/lib/app-metafields/types';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {findImageIdInContent} from '/lib/app-metafields/image/findImageIdInContent';
import {ImageIdBuilder} from '/lib/app-metafields/types';


interface GetImageUrlParams {
	siteOrProjectOrAppConfig: MetafieldsSiteConfig
	content: Content
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


export function getImageId({
	siteOrProjectOrAppConfig,
	content,
	siteOrNull,
}: GetImageUrlParams): ImageId|undefined {
	// 1. Try to find an image within the content isself
	const imageId = findImageIdInContent({
		siteOrProjectOrAppConfig,
		content,
	});
	if (imageId) {
		return imageId;
	}
	// log.info(`getImageId: Didn't find any image on content ${content._path}`);

	// 2. Fallback to siteOrProjectOrAppConfig image
	if (siteOrProjectOrAppConfig.seoImage) {
		return ImageIdBuilder.from(siteOrProjectOrAppConfig.seoImage);
	}
	// log.info(`getImageId: Not even an override image on content ${content._path}`);

	if (!siteOrNull) {
		return undefined;
	}

	// 3. Fallback to image on siteContent
	if (content._id === siteOrNull?._id) {
		return undefined; // Avoid doing the same thing twice :)
	}

	// log.info(`getImageId ${content._path} !== ${site._path}`);
	return findImageIdInContent({
		siteOrProjectOrAppConfig,
		content: siteOrNull,
	});
}
