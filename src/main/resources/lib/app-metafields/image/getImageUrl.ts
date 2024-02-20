import type {Content, Site} from '/lib/xp/content';
import type {ImageUrlParams} from '/lib/xp/portal';
import type {
	ImageId,
	MetafieldsSiteConfig
} from '/lib/app-metafields/types';


import {toStr} from '@enonic/js-utils/value/toStr';
import {get as getContentByKey} from '/lib/xp/content';
import {
	attachmentUrl,
	imageUrl
} from '/lib/xp/portal';
import {DEBUG} from '/lib/app-metafields/constants';
import {findImageIdInContent} from '/lib/app-metafields/image/findImageIdInContent';


interface GetImageUrlParams {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
	defaultImg?: ImageId
	defaultImgPrescaled?: boolean
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


function _imageUrlFromId(imageId: ImageId): string|null {
	// Set basic image options
	const imageOpts: ImageUrlParams = {
		id: imageId,

		format: 'jpg',
		quality: 85,
		scale: 'block(1200,630)', // Open Graph requires 600x315 for landscape format. Double that for retina display.
		type: 'absolute'
	};

	// Fetch actual image, make sure not to force it into .jpg if it's a SVG-file.
	const imageContent = getContentByKey<Content<{
		media: {
			attachment: string;
		}
	}>>({
		key: imageOpts.id
	});
	DEBUG && log.debug('_imageUrlFromId imageContent:%s', toStr(imageContent));

	// Application Config may reference a non-existing image
	if (!imageContent) {
		return null;
	}

	let mimeType = null;
	if (imageContent.data.media) {
		mimeType = imageContent.attachments[imageContent.data.media.attachment].mimeType; // Get the actual mimeType
	}
	// Reset forced format on SVG to make them servable through portal.imageUrl().
	if (!mimeType || mimeType === 'image/svg+xml') {
		imageOpts.quality = null;
		imageOpts.format = null;
	}

	return imageOpts.id ? imageUrl(imageOpts) : null;
}


export const getImageUrl = ({
	appOrSiteConfig,
	content,
	defaultImg,
	defaultImgPrescaled,
	siteOrNull,
}: GetImageUrlParams): string|null => {
	DEBUG && log.debug('getImageUrl defaultImg:%s defaultImgPrescaled:%s', defaultImg, defaultImgPrescaled);

	// Try to find an image in the content's image or images properties
	const imageId: ImageId|null = findImageIdInContent({
		appOrSiteConfig,
		content,
	});

	if (imageId || (defaultImg && !defaultImgPrescaled)) {
		DEBUG && log.debug('getImageUrl imageId:%s defaultImg:%s', imageId, defaultImg);
		return _imageUrlFromId(imageId || defaultImg)
	}

	if (defaultImg && defaultImgPrescaled) {
		DEBUG && log.debug('getImageUrl defaultImg:%s defaultImgPrescaled:%s', defaultImg, defaultImgPrescaled);
		// Serve pre-optimized image directly
		return attachmentUrl({
			id: defaultImg,
			type: 'absolute'
		});
	}

	if (!siteOrNull || content._id === siteOrNull._id) {
		return null
	}

	const siteImageId: ImageId|null = findImageIdInContent({
		appOrSiteConfig,
		content: siteOrNull,
	});
	if (siteImageId) {
		return _imageUrlFromId(siteImageId);
	}

	return null;
};
