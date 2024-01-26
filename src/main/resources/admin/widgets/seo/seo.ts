import {
	get as getContentByKey,
} from '/lib/xp/content';
import {
	getContent as getCurrentContent,
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
	getSite,
	getTheConfig,
	getPageTitle,
} from '/lib/common';


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
export const get = (req) => {
/*
	TODO: Display content settings? If any, then fallbacks.
	x": {
     "com-enonic-app-metafields": {
         "meta-data"
*/

	var contentId = req.params.contentId;

	if (!contentId && getCurrentContent()) {
		contentId = getCurrentContent()._id;
	}

	if (!contentId) {
		return {
			contentType: 'text/html',
			body: '<widget class="error">No content selected</widget>'
		};
	}

	var params = {};
	var content = getContentByKey({ key: contentId });

	if (content) {
		// The first part of the content '_path' is the site's URL, make sure to fetch current site!
		const parts = content._path.split('/');
		const site = getSite(parts[1]); // Send the first /x/-part of the content's path.
		if (site) {
			const siteConfig = getTheConfig(site);
			if (siteConfig) {
				const isFrontpage = site._path === content._path;
				const pageTitle = getPageTitle(content, site);
				const titleAppendix = getAppendix(site, isFrontpage);
				let description = getMetaDescription(content, site);
				if (description === '') description = null;

				const frontpageUrl = pageUrl({ path: site._path, type: "absolute" });
				const url = pageUrl({ path: content._path, type: "absolute" });
				const contentForCanonicalUrl = getContentForCanonicalUrl(content);
				const canonicalUrl = contentForCanonicalUrl ? pageUrl({ path: contentForCanonicalUrl._path, type: "absolute" }) : url;
				const justThePath = url.replace(frontpageUrl,'');
				const canonicalJustThePath = canonicalUrl.replace(frontpageUrl,'');

				let fallbackImage = siteConfig.seoImage;
				let fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
				if (isFrontpage && siteConfig.frontpageImage) {
					 fallbackImage = siteConfig.frontpageImage;
					 fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
				}
				var image = getImage(content, site, fallbackImage, fallbackImageIsPrescaled);

				params = {
					summary: {
						title: pageTitle,
						fullTitle: (pageTitle + titleAppendix),
						description: description,
						image: image,
						canonical: (siteConfig.canonical ? canonicalJustThePath : null),
						blockRobots: (siteConfig.blockRobots || getBlockRobots(content))
					},
					og: {
						type: (isFrontpage ? 'website' : 'article'),
						title: pageTitle,
						description: description,
						siteName: site.displayName,
						url: justThePath,
						locale: getLang(content,site),
						image: {
							src: image,
							width: 1200, // Twice of 600x315, for retina
							height: 630
						}
					},
					twitter: {
						active: (siteConfig.twitterUsername ? true : false),
						title: pageTitle,
						description: description,
						image: image,
						site: siteConfig.twitterUsername || null
					}
				};
			}
		}
	}

	return {
		body: render( resolve('seo.html'), params),
		contentType: 'text/html'
	};
};
