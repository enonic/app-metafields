import type {Content} from '/lib/xp/content';
import type {Resolver} from '/lib/types/guillotine';


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
import {getFullTitle} from '/lib/common/getFullTitle';
import {getSiteConfigFromSite} from '/lib/common/getSiteConfigFromSite';
import {getTheConfig} from '/lib/common/getTheConfig';
import {APP_CONFIG, APP_NAME, APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {startsWith} from '@enonic/js-utils/string/startsWith';
import {includes as arrayIncludes} from '@enonic/js-utils/array/includes';

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

	if (
		startsWith(content.type,'media:')
		|| arrayIncludes([
			'portal:fragment',
			'portal:template',
			'portal:template-folder'
		],(content.type))
	) {
		return null;
	}

	const {
		branch,
		project,
		// siteKey // NOTE: Can be undefined when x-guillotine-sitekey is missing
	} = localContext;
	const {_path} = content;
	const context = getContext();
	// log.info('contentMetaFieldsResolver context:%s', JSON.stringify(context, null, 4));
	const {
		authInfo: {
			// user: { // NOTE: Can be undefined when not logged in
			// 	login: userLogin,
			// 	idProvider: userIdProvider
			// },
			principals
		}
	} = context;
	// log.info(`resolvers content metafields context ${JSON.stringify(context, null, 4)}`);
	return runInContext({
		branch,
		repository: `com.enonic.cms.${project}`,
		// user: {
		// 	idProvider: userIdProvider,
		// 	login: userLogin,
		// },
		principals
	}, () => {
		const site = libsContentGetSite({ key: _path });
		const description = getMetaDescription({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			content,
			site
		});
		const title = getFullTitle({
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
		});
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
			locale: getLang(content, site),
			openGraph: {
				hideImages: appOrSiteConfig.removeOpenGraphImage,
				hideUrl: appOrSiteConfig.removeOpenGraphUrl,
				type: isFrontpage ? 'website' : 'article', // TODO could be expanded to support more types, see https://ogp.me/
			},
			robots: {
				follow: !blockRobots,
				index: !blockRobots,
			},
			siteName: site.displayName,
			title,
			twitter: {
				hideImages: appOrSiteConfig.removeTwitterImage,
				site: appOrSiteConfig.twitterUsername,
			},
			verification: {
				google: siteConfig.siteVerification || null
			}
		};
	});
};
