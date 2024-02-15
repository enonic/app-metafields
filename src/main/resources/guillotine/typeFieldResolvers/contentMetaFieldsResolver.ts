import type {Content} from '/lib/xp/content';
import type {Resolver} from '/lib/types/guillotine';


import {startsWith} from '@enonic/js-utils/string/startsWith';
import {includes as arrayIncludes} from '@enonic/js-utils/array/includes';
import {getSite as libsContentGetSite} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';

import {siteRelativePath} from '/lib/app-metafields/path/siteRelativePath';
import {prependBaseUrl} from '/lib/app-metafields/url/prependBaseUrl';

import {getAppOrSiteConfig} from '/lib/common/getAppOrSiteConfig';
import {getBlockRobots} from '/lib/common/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/common/getContentForCanonicalUrl';
import {getLang} from '/lib/common/getLang';
import {getMetaDescription} from '/lib/common/getMetaDescription';
import {getFullTitle} from '/lib/common/getFullTitle';
import {APP_CONFIG, APP_NAME} from '/lib/common/constants';


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
		const appOrSiteConfig = getAppOrSiteConfig({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			site
		});
		const description = getMetaDescription({
			appOrSiteConfig,
			content,
			site
		});

		const title = getFullTitle({
			appOrSiteConfig,
			content,
			site
		});
		const isFrontpage = site._path === _path;
		const blockRobots = appOrSiteConfig.blockRobots || getBlockRobots(content)

		let canonical: string|null = null;
		const contentForCanonicalUrl = getContentForCanonicalUrl(content);
		if (contentForCanonicalUrl) {
			if (appOrSiteConfig.baseUrl) {
				canonical = prependBaseUrl({
					baseUrl: appOrSiteConfig.baseUrl,
					contentPath: contentForCanonicalUrl._path,
					sitePath: site._path
				});
			} else {
				canonical = siteRelativePath({
					contentPath: contentForCanonicalUrl._path,
					sitePath: site._path
				});
			}
		} // if contentForCanonicalUrl

		const url: string = appOrSiteConfig.baseUrl
			? prependBaseUrl({
				baseUrl: appOrSiteConfig.baseUrl,
				contentPath: content._path,
				sitePath: site._path
			})
			: siteRelativePath({
				contentPath: content._path,
				sitePath: site._path
			});

		// return <Partial<GraphQLTypeToResolverResult<GraphQLMetafields>>>{
		return {
			_appOrSiteConfig: appOrSiteConfig,
			_content: content,
			_site: site,
			canonical,
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
				google: appOrSiteConfig.siteVerification || null
			},
			url,
		};
	});
};
