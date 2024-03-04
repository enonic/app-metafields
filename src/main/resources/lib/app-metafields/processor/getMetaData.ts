import type {Content} from '/lib/xp/content';
import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {pageUrl} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';

import {prependBaseUrl} from '/lib/app-metafields/url/prependBaseUrl';
import {getBlockRobots} from '/lib/app-metafields/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/app-metafields/getContentForCanonicalUrl';
import {getImageUrl} from '/lib/app-metafields/image/getImageUrl';
import {getLang} from '/lib/app-metafields/getLang';
import {getMetaDescription} from '/lib/app-metafields/getMetaDescription';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';


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
	mergedConfig: MetafieldsSiteConfig
	content?: Content
	returnType?: 'json'|'html'
	selfClosingTags?: boolean
	site: Site<MetafieldsSiteConfig>
}


function _resolveMetadata(params: MetaDataModel, selfClosingTags=false) {
	return render(resolve(`metadata${
		selfClosingTags ? '-self-closing' : ''
	}.html`), params)
}


export function getMetaData({
	mergedConfig,
	content=undefined,
	returnType="json",
	selfClosingTags=false,
	site,
}: GetMetaDataParams): MetaDataModel|string|undefined {
	if (!content) {
		return undefined;
	}

	const isFrontpage = site._path === content._path;
	const pageTitle = getPageTitle({
		mergedConfig,
		content,
	});
	const siteVerification = mergedConfig.siteVerification || null;

	const absoluteUrl = mergedConfig.baseUrl
	? prependBaseUrl({
		baseUrl: mergedConfig.baseUrl,
		contentPath: content._path,
		sitePath: site._path
	})
	: pageUrl({ path: content._path, type: "absolute" });

	const canonicalContent = getContentForCanonicalUrl(content);
	const canonicalUrl = canonicalContent
		? mergedConfig.baseUrl
			? prependBaseUrl({
				baseUrl: mergedConfig.baseUrl,
				contentPath: canonicalContent._path,
				sitePath: site._path
			})
			: pageUrl({ path: canonicalContent._path, type: "absolute" })
		: null;

	const imageUrl = !mergedConfig.removeOpenGraphImage
		? getImageUrl({
			mergedConfig,
			content,
			defaultImg: mergedConfig.seoImage,
			defaultImgPrescaled: mergedConfig.seoImageIsPrescaled,
			site,
		})
		: null;

	const twitterImageUrl = !mergedConfig.removeTwitterImage
		? getImageUrl({
			mergedConfig,
			content,
			defaultImg: mergedConfig.seoImage,
			site,
		})
		: null;

	const params: MetaDataModel = {
		blockRobots: mergedConfig.blockRobots || getBlockRobots(content),
		canonicalUrl,
		description: getMetaDescription({
			mergedConfig,
			content,
			site,
		}),
		imageHeight: 630,
		imageUrl,
		imageWidth: 1200, // Twice of 600x315, for retina
		locale: getLang({
			content,
			site,
		}),
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
		twitterUserName: mergedConfig.twitterUsername,
		twitterImageUrl,
		type: isFrontpage ? "website" : "article",
		url: mergedConfig.removeOpenGraphUrl ? null : absoluteUrl,
	};

	if (returnType === 'html') {
		return _resolveMetadata(params, selfClosingTags);
	}

	return params;
}
