import type {Content, Site} from '/lib/xp/content';
import type {ImageUrlParams} from '/lib/xp/portal';
// import type {MediaImage} from '/guillotine/guillotine.d';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {get as getContentByKey} from '/lib/xp/content';
import {
	attachmentUrl,
	imageUrl
} from '/lib/xp/portal';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {getTheConfig} from '/lib/common/getTheConfig';
import {commaStringToArray} from '/lib/common/commaStringToArray';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {stringOrNull} from '/lib/common/stringOrNull';


export const getImageUrl = ({
	applicationConfig,
	applicationKey,
	content,
	defaultImg,
	defaultImgPrescaled,
	site,
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	content: Content
	defaultImg?: string
	defaultImgPrescaled?: boolean
	site: Site<MetafieldsSiteConfig>
}) => {
	const siteConfig = getTheConfig({
		applicationConfig,
		applicationKey,
		site
	});
	const userDefinedPaths = siteConfig.pathsImages || '';
	const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;
	const setWithMixin = content.x[APP_NAME_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH].seoImage;

	let image;

	// Try to find an image in the content's image or images properties
	const imageArray = forceArray(
		setWithMixin ? stringOrNull(content.x[APP_NAME_PATH][MIXIN_PATH].seoImage)
			: userDefinedValue
			|| content.data.image
			|| content.data.images
			|| []);

	if (imageArray.length || (defaultImg && !defaultImgPrescaled)) {

		// Set basic image options
		const imageOpts: ImageUrlParams = {
			// Set the ID to either the first image in the set or use the default image ID
			id: imageArray.length ? (imageArray[0].image || imageArray[0]) : defaultImg,

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
		let mimeType = null;
		if (imageContent) {
			if (imageContent.data.media) {
				mimeType = imageContent.attachments[imageContent.data.media.attachment].mimeType; // Get the actual mimeType
			}
		}
		// Reset forced format on SVG to make them servable through portal.imageUrl().
		if (!mimeType || mimeType === 'image/svg+xml') {
			imageOpts.quality = null;
			imageOpts.format = null;
		}

		image = imageOpts.id ? imageUrl(imageOpts) : null;
	}
	else if (defaultImg && defaultImgPrescaled) {
		// Serve pre-optimized image directly
		image = attachmentUrl({
			id: defaultImg,
			type: 'absolute'
		});
	}

	// Return the image URL or nothing
	return image;
};
