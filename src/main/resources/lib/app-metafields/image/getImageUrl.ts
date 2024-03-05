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
	content: Content
	defaultImg?: ImageId
	defaultImgPrescaled?: boolean
	mergedConfig: MetafieldsSiteConfig
	site: Site<MetafieldsSiteConfig>
}


function _imageUrlFromId(imageId: ImageId): string|null {
	// Set basic image options
	const imageOpts: ImageUrlParams = {
		id: imageId,
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

	return imageOpts.id ? imageUrl(imageOpts) : null;
}


export const getImageUrl = ({
	mergedConfig,
	content,
	defaultImg,
	defaultImgPrescaled,
	site,
}: GetImageUrlParams): string|null => {
	DEBUG && log.debug('getImageUrl defaultImg:%s defaultImgPrescaled:%s', defaultImg, defaultImgPrescaled);

	// Try to find an image in the content's image or images properties
	const imageId: ImageId|null = findImageIdInContent({
		mergedConfig,
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

	if (!site || content._id === site._id) {
		return null
	}

	const siteImageId: ImageId|null = findImageIdInContent({
		mergedConfig,
		content: site,
	});
	if (siteImageId) {
		return _imageUrlFromId(siteImageId);
	}

	return null;
};
