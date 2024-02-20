import type {Request} from '/lib/app-metafields/types';


import {
	get as getContentByKey,
} from '/lib/xp/content';
import {
	getContent as getCurrentContent,
	pageUrl,
} from '/lib/xp/portal';
// @ts-expect-error // No types yet
import {render} from '/lib/thymeleaf';

import {queryForFirstSiteWithAppAndUrl} from '/admin/widgets/seo/queryForFirstSiteWithAppAndUrl';

import {prependBaseUrl} from '/lib/app-metafields/url/prependBaseUrl';
import {getAppOrSiteConfig} from '/lib/app-metafields/xp/getAppOrSiteConfig';
import {getAppendix} from '/lib/app-metafields/title/getAppendix';
import {getBlockRobots} from '/lib/app-metafields/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/app-metafields/getContentForCanonicalUrl';
import {getImageUrl} from '/lib/app-metafields/image/getImageUrl';
import {getLang} from '/lib/app-metafields/getLang';
import {getMetaDescription} from '/lib/app-metafields/getMetaDescription';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';


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
			contentType: 'text/html',
			body: '<widget class="error">No content selected</widget>'
		};
	}

	let params = {};
	const content = getContentByKey({ key: contentId });

	if (content) {
		// The first part of the content '_path' is the site's URL, make sure to fetch current site!
		const parts = content._path.split('/');
		const siteOrNull = queryForFirstSiteWithAppAndUrl({
			applicationKey: app.name, // NOTE: Using app.name is fine, since it's outside Guillotine Execution Context
			siteUrl: parts[1]
		}); // Send the first /x/-part of the content's path.

		const appOrSiteConfig = getAppOrSiteConfig({
			applicationConfig: app.config, // NOTE: Using app.config is fine, since it's outside Guillotine Execution Context
			applicationKey: app.name, // NOTE: Using app.name is fine, since it's outside Guillotine Execution Context
			siteOrNull
		});

		if (appOrSiteConfig) {
			const isFrontpage = siteOrNull?._path === content._path;
			const pageTitle = getPageTitle({
				appOrSiteConfig,
				content,
			});
			const titleAppendix = getAppendix({
				appOrSiteConfig,
				isFrontpage,
				siteOrNull,
			});
			let description = getMetaDescription({
				appOrSiteConfig,
				content,
				siteOrNull
			});
			if (description === '') description = null;

			const frontpageUrl = pageUrl({ path: siteOrNull?._path, type: "absolute" });
			const absoluteUrl = pageUrl({ path: content._path, type: "absolute" });

			let ogUrl: string;
			if (appOrSiteConfig.baseUrl) {
				ogUrl = prependBaseUrl({
					baseUrl: appOrSiteConfig.baseUrl,
					contentPath: content._path,
					sitePath: siteOrNull?._path || ''
				});
			} else {
				const justThePath = absoluteUrl.replace(frontpageUrl,'');
				ogUrl = `[SITE_URL]${justThePath}`;
			}

			let canonical = null;
			const contentForCanonicalUrl = getContentForCanonicalUrl(content);
			if (contentForCanonicalUrl) {
				if (appOrSiteConfig.baseUrl) {
					canonical = prependBaseUrl({
						baseUrl: appOrSiteConfig.baseUrl,
						contentPath: contentForCanonicalUrl
							? contentForCanonicalUrl._path
							: content._path,
						sitePath: siteOrNull?._path || ''
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
				appOrSiteConfig,
				defaultImg: appOrSiteConfig.seoImage,
				defaultImgPrescaled: appOrSiteConfig.seoImageIsPrescaled,
				content,
				siteOrNull,
			});

			params = {
				summary: {
					title: pageTitle,
					fullTitle: (pageTitle + titleAppendix),
					description: description,
					image: imageUrl,
					canonical,
					blockRobots: (appOrSiteConfig.blockRobots || getBlockRobots(content))
				},
				og: {
					type: (isFrontpage ? 'website' : 'article'),
					title: pageTitle,
					description: description,
					siteName: siteOrNull?.displayName,
					url: ogUrl,
					locale: getLang({
						content,
						siteOrNull
					}),
					image: {
						src: imageUrl,
						width: 1200, // Twice of 600x315, for retina
						height: 630
					}
				},
				twitter: {
					active: (appOrSiteConfig.twitterUsername ? true : false),
					title: pageTitle,
					description: description,
					image: imageUrl,
					site: appOrSiteConfig.twitterUsername || null
				}
			};

		} // if appOrSiteConfig
	} // if content

	return {
		body: render( resolve('seo.html'), params),
		contentType: 'text/html'
	};
};
