import type {Resolver} from '@enonic-types/guillotine';
import type {Content} from '/lib/xp/content';
import type {ContentMetaFieldsResolverReturnType} from '/guillotine/guillotine.d';


import {toStr} from '@enonic/js-utils/value/toStr';
import {startsWith} from '@enonic/js-utils/string/startsWith';
import {includes as arrayIncludes} from '@enonic/js-utils/array/includes';
import {getSite as libsContentGetSite} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';

import {APP_CONFIG, APP_NAME, DEBUG} from '/lib/app-metafields/constants';
import {siteRelativePath} from '/lib/app-metafields/path/siteRelativePath';
import {prependBaseUrl} from '/lib/app-metafields/url/prependBaseUrl';

import {getAppOrSiteConfig} from '/lib/app-metafields/xp/getAppOrSiteConfig';
import {getBlockRobots} from '/lib/app-metafields/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/app-metafields/getContentForCanonicalUrl';
import {getLang} from '/lib/app-metafields/getLang';
import {getMetaDescription} from '/lib/app-metafields/getMetaDescription';
import {getFullTitle} from '/lib/app-metafields/title/getFullTitle';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';


export const contentMetaFieldsResolver: Resolver<
	{},
	Content,
	ContentMetaFieldsResolverReturnType
> = (env) => {
	DEBUG && log.debug('contentMetaFieldsResolver env:%s', toStr(env));

	const {
		// args,
		localContext,
		source: content
	} = env;
	DEBUG && log.debug('contentMetaFieldsResolver content:%s', toStr(env));

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
	DEBUG && log.debug('contentMetaFieldsResolver context:%s', toStr(context));

	const {
		authInfo: {
			// user: { // NOTE: Can be undefined when not logged in
			// 	login: userLogin,
			// 	idProvider: userIdProvider
			// },
			principals
		}
	} = context;
	DEBUG && log.debug('contentMetaFieldsResolver principals:%s', toStr(principals));

	return runInContext({
		branch,
		repository: `com.enonic.cms.${project}`,
		// user: {
		// 	idProvider: userIdProvider,
		// 	login: userLogin,
		// },
		principals
	}, () => {
		// NOTE: app-metafields can be added directly to a project, outside of a site
		const siteOrNull = libsContentGetSite({ key: _path });
		DEBUG && log.debug('contentMetaFieldsResolver siteOrNull:%s', toStr(siteOrNull));

		const appOrSiteConfig = getAppOrSiteConfig({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			siteOrNull
		});
		DEBUG && log.debug('contentMetaFieldsResolver appOrSiteConfig:%s', toStr(appOrSiteConfig));

		const description = getMetaDescription({
			appOrSiteConfig,
			content,
			siteOrNull
		});
		DEBUG && log.debug('contentMetaFieldsResolver description:%s', description);

		const pageTitle = getPageTitle({
			appOrSiteConfig,
			content
		});

		const fullTitle = getFullTitle({
			appOrSiteConfig,
			content,
			siteOrNull
		});
		DEBUG && log.debug('contentMetaFieldsResolver fullTitle:%s', fullTitle);

		const isFrontpage = siteOrNull?._path === _path;

		const blockRobots = appOrSiteConfig.blockRobots || getBlockRobots(content)
		DEBUG && log.debug('contentMetaFieldsResolver blockRobots:%s', blockRobots);

		let canonical: string|null = null;
		const contentForCanonicalUrl = getContentForCanonicalUrl(content);
		if (contentForCanonicalUrl) {
			if (appOrSiteConfig.baseUrl) {
				canonical = prependBaseUrl({
					baseUrl: appOrSiteConfig.baseUrl,
					contentPath: contentForCanonicalUrl._path,
					sitePath: siteOrNull?._path || ''
				});
			} else {
				canonical = siteRelativePath({
					contentPath: contentForCanonicalUrl._path,
					sitePath: siteOrNull?._path || ''
				});
			}
		} // if contentForCanonicalUrl

		const url: string = appOrSiteConfig.baseUrl
			? prependBaseUrl({
				baseUrl: appOrSiteConfig.baseUrl,
				contentPath: content._path,
				sitePath: siteOrNull?._path || ''
			})
			: siteRelativePath({
				contentPath: content._path,
				sitePath: siteOrNull?._path || ''
			});
		DEBUG && log.debug('contentMetaFieldsResolver url:%s', url);

		return <ContentMetaFieldsResolverReturnType>{
			_appOrSiteConfig: appOrSiteConfig,
			_content: content,
			_siteOrNull: siteOrNull,
			canonical,
			description,
			fullTitle,
			locale: getLang({
				content,
				siteOrNull
			}),
			openGraph: {
				hideImages: appOrSiteConfig.removeOpenGraphImage,
				hideUrl: appOrSiteConfig.removeOpenGraphUrl,
				type: isFrontpage ? 'website' : 'article', // TODO could be expanded to support more types, see https://ogp.me/
			},
			robots: {
				follow: !blockRobots,
				index: !blockRobots,
			},
			siteName: siteOrNull?.displayName,
			title: pageTitle,
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
