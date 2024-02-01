import {pageUrl} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';
import {getBlockRobots} from '/lib/common/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/common/getContentForCanonicalUrl';
import {getImage} from '/lib/common/getImage';
import {getLang} from '/lib/common/getLang';
import {getMetaDescription} from '/lib/common/getMetaDescription';
import {getPageTitle} from '/lib/common/getPageTitle';
import {getTheConfig} from '/lib/common/getTheConfig';


function _resolveMetadata(params, selfClosingTags=false) {
	return render(resolve(`metadata${
		selfClosingTags ? '-self-closing' : ''
	}.html`), params)
}


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
		return _resolveMetadata(params, selfClosingTags);
	}

	return undefined;
}
