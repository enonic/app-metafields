import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {pageUrl} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';

import {prependBaseUrl} from '/lib/app-metafields/url/prependBaseUrl';
import {getBlockRobots} from '/lib/common/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/common/getContentForCanonicalUrl';
import {getImageUrl} from '/lib/common/getImageUrl';
import {getLang} from '/lib/common/getLang';
import {getMetaDescription} from '/lib/common/getMetaDescription';
import {getPageTitle} from '/lib/common/getPageTitle';


interface MetaDataModel {
	blockRobots: boolean
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

interface GetMetaDataParams {
	appOrSiteConfig: MetafieldsSiteConfig
	site: Site<MetafieldsSiteConfig>
	content?: Content
	returnType?: 'json'|'html'
	selfClosingTags?: boolean
}


function _resolveMetadata(params: MetaDataModel, selfClosingTags=false) {
	return render(resolve(`metadata${
		selfClosingTags ? '-self-closing' : ''
	}.html`), params)
}


export function getMetaData({
	appOrSiteConfig,
	site,
	content=undefined,
	returnType="json",
	selfClosingTags=false
}: GetMetaDataParams): MetaDataModel|string|undefined {
	if (!content) {
		return undefined;
	}

	const isFrontpage = site._path === content._path;
	const pageTitle = getPageTitle({
		appOrSiteConfig,
		content,
	});
	const siteVerification = appOrSiteConfig.siteVerification || null;

	const absoluteUrl = appOrSiteConfig.baseUrl
	? prependBaseUrl({
		baseUrl: appOrSiteConfig.baseUrl,
		contentPath: content._path,
		sitePath: site._path
	})
	: pageUrl({ path: content._path, type: "absolute" });

	const canonicalContent = getContentForCanonicalUrl(content);
	const canonicalUrl = canonicalContent
		? appOrSiteConfig.baseUrl
			? prependBaseUrl({
				baseUrl: appOrSiteConfig.baseUrl,
				contentPath: canonicalContent._path,
				sitePath: site._path
			})
			: pageUrl({ path: canonicalContent._path, type: "absolute" })
		: null;

	const imageUrl = !appOrSiteConfig.removeOpenGraphImage
		? getImageUrl({
			appOrSiteConfig,
			content,
			site,
			defaultImg: appOrSiteConfig.seoImage,
			defaultImgPrescaled: appOrSiteConfig.seoImageIsPrescaled
		})
		: null;

	const twitterImageUrl = !appOrSiteConfig.removeTwitterImage
		? getImageUrl({
			appOrSiteConfig,
			content,
			site,
			defaultImg: appOrSiteConfig.seoImage
		})
		: null;

	const params: MetaDataModel = {
		blockRobots: appOrSiteConfig.blockRobots || getBlockRobots(content),
		canonicalUrl,
		description: getMetaDescription({
			appOrSiteConfig,
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
		url: appOrSiteConfig.removeOpenGraphUrl ? null : absoluteUrl,
	};

	if (returnType === 'html') {
		return _resolveMetadata(params, selfClosingTags);
	}

	return params;
}
