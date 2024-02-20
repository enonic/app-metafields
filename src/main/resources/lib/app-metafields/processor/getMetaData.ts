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
	siteOrProjectOrAppConfig: MetafieldsSiteConfig
	content?: Content
	returnType?: 'json'|'html'
	selfClosingTags?: boolean
	siteOrNull: Site<MetafieldsSiteConfig>|null
}


function _resolveMetadata(params: MetaDataModel, selfClosingTags=false) {
	return render(resolve(`metadata${
		selfClosingTags ? '-self-closing' : ''
	}.html`), params)
}


export function getMetaData({
	siteOrProjectOrAppConfig,
	content=undefined,
	returnType="json",
	selfClosingTags=false,
	siteOrNull,
}: GetMetaDataParams): MetaDataModel|string|undefined {
	if (!content) {
		return undefined;
	}

	const isFrontpage = siteOrNull?._path === content._path;
	const pageTitle = getPageTitle({
		siteOrProjectOrAppConfig,
		content,
	});
	const siteVerification = siteOrProjectOrAppConfig.siteVerification || null;

	const absoluteUrl = siteOrProjectOrAppConfig.baseUrl
	? prependBaseUrl({
		baseUrl: siteOrProjectOrAppConfig.baseUrl,
		contentPath: content._path,
		sitePath: siteOrNull?._path || ''
	})
	: pageUrl({ path: content._path, type: "absolute" });

	const canonicalContent = getContentForCanonicalUrl(content);
	const canonicalUrl = canonicalContent
		? siteOrProjectOrAppConfig.baseUrl
			? prependBaseUrl({
				baseUrl: siteOrProjectOrAppConfig.baseUrl,
				contentPath: canonicalContent._path,
				sitePath: siteOrNull?._path || ''
			})
			: pageUrl({ path: canonicalContent._path, type: "absolute" })
		: null;

	const imageUrl = !siteOrProjectOrAppConfig.removeOpenGraphImage
		? getImageUrl({
			siteOrProjectOrAppConfig,
			content,
			defaultImg: siteOrProjectOrAppConfig.seoImage,
			defaultImgPrescaled: siteOrProjectOrAppConfig.seoImageIsPrescaled,
			siteOrNull,
		})
		: null;

	const twitterImageUrl = !siteOrProjectOrAppConfig.removeTwitterImage
		? getImageUrl({
			siteOrProjectOrAppConfig,
			content,
			defaultImg: siteOrProjectOrAppConfig.seoImage,
			siteOrNull,
		})
		: null;

	const params: MetaDataModel = {
		blockRobots: siteOrProjectOrAppConfig.blockRobots || getBlockRobots(content),
		canonicalUrl,
		description: getMetaDescription({
			siteOrProjectOrAppConfig,
			content,
			siteOrNull
		}),
		imageHeight: 630,
		imageUrl,
		imageWidth: 1200, // Twice of 600x315, for retina
		locale: getLang({
			content,
			siteOrNull
		}),
		openGraph: {
			article: isFrontpage ? null : {
				expirationTime: content.publish?.to,
				modifiedTime: content.publish?.from,
				publishedTime: content.publish?.first,
			}
		},
		siteName: siteOrNull?.displayName,
		siteVerification,
		title: pageTitle,
		twitterUserName: siteOrProjectOrAppConfig.twitterUsername,
		twitterImageUrl,
		type: isFrontpage ? "website" : "article",
		url: siteOrProjectOrAppConfig.removeOpenGraphUrl ? null : absoluteUrl,
	};

	if (returnType === 'html') {
		return _resolveMetadata(params, selfClosingTags);
	}

	return params;
}
