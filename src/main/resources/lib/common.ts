import type {Content} from '/lib/xp/content';
import type {
	ImageUrlParams,
	Site,
} from '/lib/xp/portal';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {
	attachmentUrl,
	getSiteConfig as libPortalGetSiteConfig,
	imageUrl
} from '/lib/xp/portal';
import {
	get as getContentByKey,
	query
} from '/lib/xp/content';
// @ts-expect-error // No types yet
import {app as libUtilApp} from '/lib/util';

interface MetafieldsSiteConfig {
	blockRobots?: boolean
	canonical?: boolean
	disableAppConfig?: boolean
	frontpageImage?: string
	frontpageImageIsPrescaled?: boolean
	fullPath?: boolean
	headless?: boolean
	pathsDescriptions?: string // with comma
	pathsImages?: string // with comma
	pathsTitles?: string // with comma
	seoDescription?: string
	seoImage?: string
	seoImageIsPrescaled?: boolean
	seoTitle?: string
	siteVerification?: string
	removeOpenGraphImage?: boolean
	removeOpenGraphUrl?: boolean
	removeTwitterImage?: boolean
	titleBehaviour?: boolean
	titleFrontpageBehaviour?: boolean
	titleSeparator?: string
	twitterUsername?: string
}


let appNamePath = libUtilApp.getJsonName();
let mixinPath = 'meta-data';

// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
export const getTheConfig = (site: Site<MetafieldsSiteConfig>) => {
	let config = libPortalGetSiteConfig<MetafieldsSiteConfig>();
	if (!config) {
		config = getSiteConfig(site, app.name);
	}
	if (app.config && !config.disableAppConfig) {
		for (let prop in app.config) {
			let value: string|boolean = app.config[prop];
			if (prop !== 'config.filename' && prop !== 'service.pid') { // Default props for .cfg-files, not to use further.
				if (value === 'true' || value === 'false') {
					value = value === 'true';
				}
				config[prop] = value;
			}
		}
	}
	return config;
};

export const getLang = (content, site) => {
	// Format locale into the ISO format that Open Graph wants.
	let locale = 'en_US';
	if (content.language || site.language) {
		locale = (content.language || site.language).replace('-', '_');
	}
	return locale;
}

export const getSite = (siteUrl: string) => {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	const sitesResult = query<Site<MetafieldsSiteConfig>>({
		query: "_path LIKE '/content/*' AND _name LIKE '" + siteUrl + "' AND data.siteConfig.applicationKey = '" + app.name + "'",
		contentTypes: ["portal:site"]
	});
	return sitesResult.hits[0];
}

// Find the site config even when the context is not known.
export const getSiteConfig = (site: Site<MetafieldsSiteConfig>, applicationKey: string) => {
	// Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
	if (site) {
		if (site.data) {
			if (site.data.siteConfig) {
				var siteConfigs = forceArray(site.data.siteConfig);
				let siteConfig: Partial<typeof siteConfigs[0]> = {};
				siteConfigs.forEach((cfg) => {
					if (applicationKey && cfg.applicationKey == applicationKey) {
						siteConfig = cfg;
					} else if (!applicationKey && cfg.applicationKey == app.name) {
						siteConfig = cfg;
					}
				});
				return siteConfig.config;
			}
		}
	}
};


function commaStringToArray(str) {
	var commas = str || '';
	var arr = commas.split(',');
	if (arr) {
		arr = arr.map(function (s) { return s.trim() });
	} else {
		arr = forceArray(str); // Make sure we always work with an array
	}
	return arr;
}

function findValueInJson(json, paths, fullPath) {
	var value = null;
	var pathLength = paths.length;
	var jsonPath;

	for (var i = 0; i < pathLength; i++) {
		if (paths[i]) {
			jsonPath = (fullPath) ? 'json["' + paths[i].split('.').join('"]["') + '"]' : 'json.data["' + paths[i].split('.').join('"]["') + '"]'; // Wrap property so we can have dashes in it
			// log.info('jsonPath: %s', jsonPath);
			try {
				// value = eval(jsonPath); // https://esbuild.github.io/link/direct-eval
				value = (0, eval)(jsonPath);
			} catch (e) {
				// Noop
			}
			if (value) {
				if (value.trim() === "")
					value = null; // Reset value if empty string (skip empties)
				else
					break; // Expect the first property in the string is the most important one to use
			} // if value
		} // if paths[i]
	} // for
	return value;
} // function findValueInJson

function isString(o) {
	return typeof o === 'string' || o instanceof String;
}

function stringOrNull(o) {
	return isString(o) ? o : null;
}

// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
export const getAppendix = (site, isFrontpage?: boolean) => {
	const siteConfig = getTheConfig(site);
	let titleAppendix = '';
	if (siteConfig.titleBehaviour || !siteConfig.hasOwnProperty("titleBehaviour")) {
		var separator = siteConfig.titleSeparator || '-';
		var titleRemoveOnFrontpage = siteConfig.hasOwnProperty("titleFrontpageBehaviour") ? siteConfig.titleFrontpageBehaviour : true; // Default true needs to be respected
		if (!isFrontpage || !titleRemoveOnFrontpage) {
			titleAppendix = ' ' + separator + ' ' + site.displayName;
		}
	}
	return titleAppendix;
};

export const getBlockRobots = (content) => {
	var setWithMixin = content.x[appNamePath]
		&& content.x[appNamePath][mixinPath]
		&& content.x[appNamePath][mixinPath].blockRobots;
	return setWithMixin;
};

export const getContentForCanonicalUrl = (content) => {
	var setWithMixin = content.x[appNamePath]
		&& content.x[appNamePath][mixinPath]
		&& content.x[appNamePath][mixinPath].seoContentForCanonicalUrl
		&& getContentByKey({
			key: content.x[appNamePath][mixinPath].seoContentForCanonicalUrl
		});
	return setWithMixin;
};

export const getPageTitle = (content, site) => {
	var siteConfig = getTheConfig(site);

	var userDefinedPaths = siteConfig.pathsTitles || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findValueInJson(content, userDefinedArray, siteConfig.fullPath) : null;

	var setWithMixin = content.x[appNamePath]
		&& content.x[appNamePath][mixinPath]
		&& content.x[appNamePath][mixinPath].seoTitle;

	var metaTitle = setWithMixin ? stringOrNull(content.x[appNamePath][mixinPath].seoTitle) // Get from mixin
		: stringOrNull(userDefinedValue) // json property defined by user as important
		|| stringOrNull(content.data.title) || stringOrNull(content.data.heading) || stringOrNull(content.data.header) // Use other typical content titles (overrides displayName)
		|| stringOrNull(content.displayName) // Use content's display name
		|| stringOrNull(siteConfig.seoTitle) // Use default og-title for site
		|| stringOrNull(site.displayName) // Use site default
		|| ''

	return metaTitle;
};

export const getMetaDescription = (content, site) => {
	var siteConfig = getTheConfig(site);

	var userDefinedPaths = siteConfig.pathsDescriptions || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findValueInJson(content, userDefinedArray, siteConfig.fullPath) : null;

	var setWithMixin = content.x[appNamePath]
		&& content.x[appNamePath][mixinPath]
		&& content.x[appNamePath][mixinPath].seoDescription;

	var metaDescription = setWithMixin ? content.x[appNamePath][mixinPath].seoDescription // Get from mixin
		: userDefinedValue
		|| content.data.preface || content.data.description || content.data.summary // Use typical content summary names
		|| siteConfig.seoDescription // Use default for site
		|| site.description // Use bottom default
		|| ''; // Don't crash plugin on clean installs

	// Strip away all html tags, in case there's any in the description.
	var regex = /(<([^>]+)>)/ig;
	metaDescription = metaDescription.replace(regex, "");

	return metaDescription;
};

export const getImage = (content, site, defaultImg: string, defaultImgPrescaled?: boolean) => {
	const siteConfig = getTheConfig(site);
	const userDefinedPaths = siteConfig.pathsImages || '';
	const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findValueInJson(content, userDefinedArray, siteConfig.fullPath) : null;
	const setWithMixin = content.x[appNamePath]
		&& content.x[appNamePath][mixinPath]
		&& content.x[appNamePath][mixinPath].seoImage;

	let image;

	// Try to find an image in the content's image or images properties
	const imageArray = forceArray(
		setWithMixin ? stringOrNull(content.x[appNamePath][mixinPath].seoImage)
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
