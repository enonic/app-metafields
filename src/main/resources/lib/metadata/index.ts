import {
	get as getContentByKey,
	getSite as libsContentGetSite,
	getSiteConfig as libsContentGetSiteConfig,
} from '/lib/xp/content';
import {
	getContent as getCurrentContent,
	getSite as libPortalGetSite,
	getSiteConfig as libPortalGetSiteConfig,
	pageUrl,
} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';
import {
	getAppendix,
	getBlockRobots,
	getContentForCanonicalUrl,
	getImage,
	getLang,
	getMetaDescription,
	getPageTitle,
	getTheConfig,
} from '/lib/common';


const OG_ATTRIBUTE = "og: http://ogp.me/ns#";


export function getMetaData(site, siteConfig, content=undefined, returnType="json", selfClosingTags=false) {
	if (!content) {
		return undefined;
	}

	const appOrSiteConfig = getTheConfig(site);

	const isFrontpage = site._path === content._path;
	const pageTitle = getPageTitle(content, site);
	const siteVerification = siteConfig.siteVerification || null;

	let url = !appOrSiteConfig.removeOpenGraphUrl
		? pageUrl({ path: content._path, type: "absolute" })
		: null;
	const canonicalContent = getContentForCanonicalUrl(content);
	const canonicalUrl = canonicalContent
		? pageUrl({ path: canonicalContent._path, type: "absolute"})
		: url;
	let fallbackImage = siteConfig.seoImage;
	let fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
	if (isFrontpage && siteConfig.frontpageImage) {
		fallbackImage = siteConfig.frontpageImage;
		fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
	}

	const imageUrl = !appOrSiteConfig.removeOpenGraphImage
		? getImage(content, site, fallbackImage, fallbackImageIsPrescaled)
		: null;

	const twitterImageUrl = !appOrSiteConfig.removeTwitterImage
		? getImage(content, site, fallbackImage)
		: null;

	const params = {
		title: pageTitle,
		description: getMetaDescription(content, site),
		siteName: site.displayName,
		locale: getLang(content, site),
		type: isFrontpage ? "website" : "article",
		url,
		canonicalUrl,
		imageUrl,
		imageWidth: 1200, // Twice of 600x315, for retina
		imageHeight: 630,
		blockRobots: siteConfig.blockRobots || getBlockRobots(content),
		siteVerification,
		canonical: siteConfig.canonical,
		twitterUserName: appOrSiteConfig.twitterUsername,
		twitterImageUrl,
	};

	if (returnType === 'json') {
		return params;
	}

	if (returnType === 'html') {
		return resolveMetadata(params, selfClosingTags);
	}

	return undefined;
}

export function getTitle(site, content=undefined) {
	if (!content) {
		return undefined;
	}

	const isFrontpage = site._path === content._path;
	const titleAppendix = getAppendix(site, isFrontpage);
	const pageTitle = getPageTitle(content, site);
	const titleHtml = "<title>" + pageTitle + titleAppendix + "</title>";

	return titleHtml;
}

export function getFixedHtmlAttrsAsString(htmlTag) {
	const htmlIndex = htmlTag.toLowerCase().indexOf("<html");
	const endHtmlIndex = htmlTag.indexOf(">", htmlIndex);
	const htmlTagContents = htmlTag.substr(htmlIndex + 5, endHtmlIndex - htmlIndex - 5).trim();

	let htmlTagAttributes = htmlTagContents.split("=") || []; // Split on = so we can locate all the attributes.
	let prefixFound = false;

	for (let i = 0; i < htmlTagAttributes.length; i++) {
		if (htmlTagAttributes[i].toLowerCase().trim() === "prefix") {
			prefixFound = true;
			if (htmlTagAttributes[i + 1].indexOf(OG_ATTRIBUTE) === -1) {
				//log.info("Before join - " + htmlTagAttributes[i+1]);
				htmlTagAttributes[i + 1] =
					htmlTagAttributes[i + 1].substr(
						0,
						htmlTagAttributes[i + 1].length - 1
					) +
					" " +
					OG_ATTRIBUTE +
					htmlTagAttributes[i + 1].substr(-1);
				//log.info("After join - " + htmlTagAttributes[i+1]);
			} else {
				//log.info("Already in the tag!");
			}
		}
	}
	// Join the new html element string
	let innerHtmlTagText = htmlTagAttributes.join("=");

	if (!prefixFound) innerHtmlTagText += ' prefix="' + OG_ATTRIBUTE + '"';

	return innerHtmlTagText;
}

export function getReusableData(contentPath=undefined) {
	let site, content, siteConfig;

	if (!contentPath) {
		site = libPortalGetSite();
		content = getCurrentContent();
		siteConfig = libPortalGetSiteConfig();
	} else {
		content = getContentByKey({ key: contentPath });
		site = libsContentGetSite({ key: contentPath });
		siteConfig = libsContentGetSiteConfig({ key: contentPath, applicationKey: app.name });
	}

	return { site, content, siteConfig };
}

// Functions below are only used internally

function resolveMetadata(params, selfClosingTags=false) {
	return render(resolve(`metadata${
		selfClosingTags ? '-self-closing' : ''
	}.html`), params)
}
