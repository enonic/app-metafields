import type {Content} from '/lib/xp/content';
import type {Resolver} from '/guillotine/guillotine.d';


import {
	get as getContentByKey,
	getSite as libsContentGetSite,
} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';
import {getBlockRobots} from '/lib/common/getBlockRobots';
import {getLang} from '/lib/common/getLang';
import {getMetaDescription} from '/lib/common/getMetaDescription';
import {getPageTitle} from '/lib/common/getPageTitle';
import {getSiteConfigFromSite} from '/lib/common/getSiteConfigFromSite';
import {getTheConfig} from '/lib/common/getTheConfig';
import {APP_CONFIG, APP_NAME, APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';


export const contentMetaFieldsResolver: Resolver<
	{},
	Content
> = (env) => {
	// log.info(`resolvers content metafields ${JSON.stringify(env, null, 4)}`);
	const {
		// args,
		localContext,
		source: content
	} = env;
	const {
		branch,
		project,
		// siteKey // NOTE: Can be undefined when x-guillotine-sitekey is missing
	} = localContext;
	const {_path} = content;
	const context = getContext();
	const {
		authInfo: {
			user: {
				login: userLogin,
				idProvider: userIdProvider
			},
			principals
		}
	} = context;
	// log.info(`resolvers content metafields context ${JSON.stringify(context, null, 4)}`);
	return runInContext({
		branch,
		repository: `com.enonic.cms.${project}`,
		user: {
			idProvider: userIdProvider,
			login: userLogin,
		},
		principals
	}, () => {
		const site = libsContentGetSite({ key: _path });
		const description = getMetaDescription({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			content,
			site
		});
		const title = getPageTitle({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			content,
			site
		});
		const appOrSiteConfig = getTheConfig({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			site
		});
		const isFrontpage = site._path === _path;
		const siteConfig = getSiteConfigFromSite({
			applicationKey: APP_NAME,
			site
		})
		const blockRobots = siteConfig.blockRobots || getBlockRobots(content)

		let canonical = null;
		if (content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoContentForCanonicalUrl) {
			const canonicalContent = getContentByKey({
				key: content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl as string
			});
			if (canonicalContent) {
				canonical = canonicalContent._path;
			} else {
				log.error(`content.x.${APP_NAME_PATH}.${MIXIN_PATH}.seoContentForCanonicalUrl for content with _path:${_path} references a non-existing content with key:${content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl}`);
			}
		}
		return {
			_content: content,
			_site: site,
			_siteConfig: siteConfig,
			alternates: {
				canonical
			},
			description,
			// images: imageIds,
			// images: [{
			// 	_id: 'f0ada1c6-f80f-4872-87ff-f10313499081'
			// },{
			// 	_id: '358cd06c-d97b-4088-963c-e32170bd7866'
			// }],
			openGraph: {
				// description, // NOTE: Also available on toplevel
				// images: appOrSiteConfig.removeOpenGraphImage ? [] : images
				locale: getLang(content, site),
				siteName: site.displayName,
				// title, // NOTE: Also available on toplevel
				type: isFrontpage ? 'website' : 'article',
				url: appOrSiteConfig.removeOpenGraphUrl ? null : _path,
			},
			robots: {
				follow: !blockRobots,
				index: !blockRobots,
			},
			title,
			twitter: {
				// description, // NOTE: Also available on toplevel
				// images: appOrSiteConfig.removeTwitterImage ? [] : images
				// title, // NOTE: Also available on toplevel
				creator: appOrSiteConfig.twitterUsername
			},
			verification: {
				google: siteConfig.siteVerification || null
			}
		};
	});
};
