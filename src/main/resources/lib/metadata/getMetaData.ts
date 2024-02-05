import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '../types/MetafieldsSiteConfig';


import {pageUrl} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';
import {getBlockRobots} from '/lib/common/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/common/getContentForCanonicalUrl';
import {getImageUrl} from '../common/getImageUrl';
import {getLang} from '/lib/common/getLang';
import {getMetaDescription} from '/lib/common/getMetaDescription';
import {getPageTitle} from '/lib/common/getPageTitle';
import {getTheConfig} from '/lib/common/getTheConfig';


function _resolveMetadata(params, selfClosingTags=false) {
	return render(resolve(`metadata${
		selfClosingTags ? '-self-closing' : ''
	}.html`), params)
}

interface MetaDataModel {
	blockRobots: boolean
	canonical: boolean
	canonicalUrl: string
	description: string
	imageHeight: number
	imageUrl: string
	imageWidth: number
	locale: string
	openGraph: {
		article: {
			expirationTime: string
			modifiedTime: string
			publishedTime: string
		}|null
	}
	siteName: string
	siteVerification: string
	title: string
	twitterImageUrl: string
	twitterUserName: string
	type: string
	url: string
}

export function getMetaData({
	applicationConfig,
	applicationKey,
	site,
	siteConfig,
	content=undefined,
	returnType="json",
	selfClosingTags=false
}: {
	applicationConfig: Record<string, string|boolean>
	applicationKey: string
	site: Site<MetafieldsSiteConfig>
	siteConfig: MetafieldsSiteConfig
	content?: Content
	returnType?: 'json'|'html'
	selfClosingTags?: boolean
}): MetaDataModel|string|undefined {
	if (!content) {
		return undefined;
	}

	const appOrSiteConfig = getTheConfig({
		applicationConfig,
		applicationKey,
		site
	});

	const isFrontpage = site._path === content._path;
	const pageTitle = getPageTitle({
		applicationConfig,
		applicationKey,
		content,
		site
	});
	const siteVerification = siteConfig.siteVerification || null;

	let url = !appOrSiteConfig.removeOpenGraphUrl
		? pageUrl({ path: content._path, type: "absolute" })
		: null;
	const canonicalContent = getContentForCanonicalUrl(content);
	const canonicalUrl = canonicalContent
		? pageUrl({ path: canonicalContent._path, type: "absolute"})
		: url;

	const imageUrl = !appOrSiteConfig.removeOpenGraphImage
		? getImageUrl({
			applicationConfig,
			applicationKey,
			content,
			site,
			defaultImg: siteConfig.seoImage,
			defaultImgPrescaled: siteConfig.seoImageIsPrescaled
		})
		: null;

	const twitterImageUrl = !appOrSiteConfig.removeTwitterImage
		? getImageUrl({
			applicationConfig,
			applicationKey,
			content,
			site,
			defaultImg: siteConfig.seoImage
		})
		: null;

	const params: MetaDataModel = {
		blockRobots: siteConfig.blockRobots || getBlockRobots(content),
		canonical: siteConfig.canonical,
		canonicalUrl,
		description: getMetaDescription({
			applicationConfig,
			applicationKey,
			content,
			site
		}),
		imageHeight: 630,
		imageUrl,
		imageWidth: 1200, // Twice of 600x315, for retina
		locale: getLang(content, site),
		openGraph: {
			article: isFrontpage ? null : {
				expirationTime: content.publish?.to,
				modifiedTime: content.publish?.from,
				publishedTime: content.publish?.first,
			}
		},
		siteName: site.displayName,
		siteVerification,
		title: pageTitle,
		twitterUserName: appOrSiteConfig.twitterUsername,
		twitterImageUrl,
		type: isFrontpage ? "website" : "article",
		url,
	};

	if (returnType === 'html') {
		return _resolveMetadata(params, selfClosingTags);
	}

	return params;
}
