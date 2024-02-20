// import type {
// 	// GraphQLTypeToResolverResult,
// 	Resolver,
// } from '@enonic-types/guillotine';
import type {Content} from '/lib/xp/content';
import type {Resolver} from '/lib/app-metafields/types/guillotine';
// import type {GraphQLMetafields} from '/guillotine/guillotine.d';


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

import {getSiteOrProjectOrAppConfig} from '/lib/app-metafields/xp/getSiteOrProjectOrAppConfig';
import {getBlockRobots} from '/lib/app-metafields/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/app-metafields/getContentForCanonicalUrl';
import {getLang} from '/lib/app-metafields/getLang';
import {getMetaDescription} from '/lib/app-metafields/getMetaDescription';
import {getFullTitle} from '/lib/app-metafields/title/getFullTitle';


export const contentMetaFieldsResolver: Resolver<
	{},
	Content
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
		project: projectName,
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
		repository: `com.enonic.cms.${projectName}`,
		// user: {
		// 	idProvider: userIdProvider,
		// 	login: userLogin,
		// },
		principals
	}, () => {
		// NOTE: app-metafields can be added directly to a project, outside of a site
		const siteOrNull = libsContentGetSite({ key: _path });
		DEBUG && log.debug('contentMetaFieldsResolver siteOrNull:%s', toStr(siteOrNull));

		const siteOrProjectOrAppConfig = getSiteOrProjectOrAppConfig({
			applicationConfig: APP_CONFIG,
			applicationKey: APP_NAME,
			siteOrNull
		});
		DEBUG && log.debug('contentMetaFieldsResolver siteOrProjectOrAppConfig:%s', toStr(siteOrProjectOrAppConfig));

		const description = getMetaDescription({
			siteOrProjectOrAppConfig,
			content,
			siteOrNull
		});
		DEBUG && log.debug('contentMetaFieldsResolver description:%s', description);

		const title = getFullTitle({
			siteOrProjectOrAppConfig,
			content,
			siteOrNull
		});
		DEBUG && log.debug('contentMetaFieldsResolver title:%s', title);

		const isFrontpage = siteOrNull?._path === _path;

		const blockRobots = siteOrProjectOrAppConfig.blockRobots || getBlockRobots(content)
		DEBUG && log.debug('contentMetaFieldsResolver blockRobots:%s', blockRobots);

		let canonical: string|null = null;
		const contentForCanonicalUrl = getContentForCanonicalUrl(content);
		if (contentForCanonicalUrl) {
			if (siteOrProjectOrAppConfig.baseUrl) {
				canonical = prependBaseUrl({
					baseUrl: siteOrProjectOrAppConfig.baseUrl,
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

		const url: string = siteOrProjectOrAppConfig.baseUrl
			? prependBaseUrl({
				baseUrl: siteOrProjectOrAppConfig.baseUrl,
				contentPath: content._path,
				sitePath: siteOrNull?._path || ''
			})
			: siteRelativePath({
				contentPath: content._path,
				sitePath: siteOrNull?._path || ''
			});
		DEBUG && log.debug('contentMetaFieldsResolver url:%s', url);

		// return <Partial<GraphQLTypeToResolverResult<GraphQLMetafields>>>{
		return {
			_appOrSiteConfig: siteOrProjectOrAppConfig,
			_content: content,
			_siteOrNull: siteOrNull,
			canonical,
			description,
			locale: getLang({
				content,
				siteOrNull
			}),
			openGraph: {
				hideImages: siteOrProjectOrAppConfig.removeOpenGraphImage,
				hideUrl: siteOrProjectOrAppConfig.removeOpenGraphUrl,
				type: isFrontpage ? 'website' : 'article', // TODO could be expanded to support more types, see https://ogp.me/
			},
			robots: {
				follow: !blockRobots,
				index: !blockRobots,
			},
			siteName: siteOrNull?.displayName,
			title,
			twitter: {
				hideImages: siteOrProjectOrAppConfig.removeTwitterImage,
				site: siteOrProjectOrAppConfig.twitterUsername,
			},
			verification: {
				google: siteOrProjectOrAppConfig.siteVerification || null
			},
			url,
		};
	});
};
