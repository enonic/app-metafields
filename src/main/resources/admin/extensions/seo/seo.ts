import type {Site} from '@enonic-types/lib-content';
import type {Request} from '/lib/app-metafields/types';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {toStr} from '@enonic/js-utils/value/toStr';
import {startsWith} from '@enonic/js-utils/string/startsWith';
import {includes as arrayIncludes} from '@enonic/js-utils/array/includes';
import {
	get as getContentByKey,
	getSite as getSiteByKey,
} from '/lib/xp/content';
import {
	getContent as getCurrentContent,
	pageUrl,
} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';

import {DEBUG} from '/lib/app-metafields/constants';
import {prependBaseUrl} from '/lib/app-metafields/url/prependBaseUrl';
import {getMergedConfig} from '/lib/app-metafields/xp/getMergedConfig';
import {getAppendix} from '/lib/app-metafields/title/getAppendix';
import {getBlockRobots} from '/lib/app-metafields/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/app-metafields/getContentForCanonicalUrl';
import {getImageUrl} from '/lib/app-metafields/image/getImageUrl';
import {getLang} from '/lib/app-metafields/getLang';
import {getMetaDescription} from '/lib/app-metafields/getMetaDescription';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';
import {getSiteConfigOrNullFromContentKey} from '/lib/app-metafields/xp/getSiteConfigOrNullFromContentKey';


const CONTENT_TYPE = 'text/html';

/*
TODO: Refactoring of code in JS ... perhaps create entire ojects for each social media in common.js?
TODO: Link to Twitter/FB debuggers in a way so that the end-URL is sent to them (auto post?).
TODO: Possible to minimize help-texts (remember with cookie).
TODO: Somehow piece together the full end-URL (respecting vhost) instead of showing the admin-url. Currently not possible in XP to get "end URL" with code as code is not aware of server config.
TODO: Don't spawn anything for content without templates, folders, images, etc. Gives no meaning.
TODO: Perhaps add (?) icons with info for each data.
TODO: Possibility to click title, desc, image and see the water fall logic and where data is found?
TODO: Grade each data based on amount of text etc. Red, yellow, green. And info about it (best-practise).
*/
export const get = (req: Request) => {
/*
	TODO: Display content settings? If any, then fallbacks.
	x": {
     "com-enonic-app-metafields": {
         "meta-data"
*/
	let contentId = req.params.contentId;

	if (!contentId && getCurrentContent()) {
		contentId = getCurrentContent()._id;
	}

	if (!contentId) {
		return {
			body: '<widget class="error">No content selected</widget>',
			contentType: CONTENT_TYPE,
		};
	}

	const content = getContentByKey({ key: contentId });
	DEBUG && log.debug('seo widget content:%s', toStr(content));

	if (!content) {
		return {
			body: render( resolve('seo.html'), {}),
			contentType: CONTENT_TYPE
		};
	}

	if (
		startsWith(content.type,'media:')
		|| arrayIncludes([
			'portal:fragment',
			'portal:template',
			'portal:template-folder'
		],(content.type))
	) {
		return {
			body: `<widget class='error'>No metafields for contentType:${content.type}</widget>`,
			contentType: CONTENT_TYPE,
		};
	}

	const site: Site<MetafieldsSiteConfig>|null = getSiteByKey<MetafieldsSiteConfig>({ key: content._path });
	DEBUG && log.debug('seo widget site:%s', toStr(site));

	if (!site) {
		return {
			body: `<widget class='error'>No metafields outside a site</widget>`,
			contentType: CONTENT_TYPE,
		};
	}

	const siteConfig = getSiteConfigOrNullFromContentKey(content._path)
	DEBUG && log.debug('seo widget siteConfig:%s', toStr(siteConfig));
	if (!siteConfig) {
		return {
			body: render( resolve('seo.html'), {}),
			contentType: CONTENT_TYPE
		};
	}

	const mergedConfig = getMergedConfig({siteConfig});
	DEBUG && log.debug('seo widget mergedConfig:%s', toStr(mergedConfig));

	if (!mergedConfig) {
		return {
			body: render( resolve('seo.html'), {}),
			contentType: CONTENT_TYPE
		};
	}

	const isFrontpage = site._path === content._path;
	DEBUG && log.debug('seo widget isFrontpage:%s', isFrontpage);

	const pageTitle = getPageTitle({
		mergedConfig,
		content,
	});
	const titleAppendix = getAppendix({
		mergedConfig,
		isFrontpage,
		site,
	});
	let description = getMetaDescription({
		mergedConfig,
		content,
		site,
	});
	if (description === '') description = null;

	const frontpageUrl = pageUrl({ path: site._path, type: "absolute" });
	const absoluteUrl = pageUrl({ path: content._path, type: "absolute" });

	let ogUrl: string;
	if (mergedConfig.baseUrl) {
		ogUrl = prependBaseUrl({
			baseUrl: mergedConfig.baseUrl,
			contentPath: content._path,
			sitePath: site._path
		});
	} else {
		const justThePath = absoluteUrl.replace(frontpageUrl,'');
		ogUrl = `[SITE_URL]${justThePath}`;
	}

	let canonical = null;
	const contentForCanonicalUrl = getContentForCanonicalUrl(content);
	if (contentForCanonicalUrl) {
		if (mergedConfig.baseUrl) {
			canonical = prependBaseUrl({
				baseUrl: mergedConfig.baseUrl,
				contentPath: contentForCanonicalUrl
					? contentForCanonicalUrl._path
					: content._path,
				sitePath: site._path
			});
		} else {
			const canonicalUrl = contentForCanonicalUrl
				? pageUrl({ path: contentForCanonicalUrl._path, type: "absolute" })
				: absoluteUrl;
			const canonicalJustThePath = canonicalUrl.replace(frontpageUrl,'');
			canonical = `[SITE_URL]${canonicalJustThePath}`;
		}
	}

	const imageUrl: string|null = getImageUrl({
		mergedConfig,
		defaultImg: mergedConfig.seoImage,
		defaultImgPrescaled: mergedConfig.seoImageIsPrescaled,
		content,
		site,
	});

	const params = {
		summary: {
			title: pageTitle,
			fullTitle: (pageTitle + titleAppendix),
			description: description,
			image: imageUrl,
			canonical,
			blockRobots: (mergedConfig.blockRobots || getBlockRobots(content))
		},
		og: {
			type: (isFrontpage ? 'website' : 'article'),
			title: pageTitle,
			description: description,
			siteName: site.displayName,
			url: ogUrl,
			locale: getLang({
				content,
				site,
			}),
			image: {
				src: imageUrl,
				width: 1200, // Twice of 600x315, for retina
				height: 630
			}
		},
		twitter: {
			active: (mergedConfig.twitterUsername ? true : false),
			title: pageTitle,
			description: description,
			image: imageUrl,
			site: mergedConfig.twitterUsername || null
		}
	};
	DEBUG && log.debug('seo widget params:%s', toStr(params));

	return {
		body: render( resolve('seo.html'), params),
		contentType: CONTENT_TYPE
	};
};
