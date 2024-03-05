import type {
	DataFetcherResult,
	GraphQL,
	Resolver,
} from '@enonic-types/guillotine';
import type {Content, Site} from '@enonic-types/lib-content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';
import type {ContentMetaFieldsResolverReturnType} from '/guillotine/guillotine.d';


import {toStr} from '@enonic/js-utils/value/toStr';
import {startsWith} from '@enonic/js-utils/string/startsWith';
import {includes as arrayIncludes} from '@enonic/js-utils/array/includes';
import {getSite as getSiteByKey} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';

import {DEBUG} from '/lib/app-metafields/constants';
import {getMergedConfig} from '/lib/app-metafields/xp/getMergedConfig';
import {getBlockRobots} from '/lib/app-metafields/getBlockRobots';
import {getContentForCanonicalUrl} from '/lib/app-metafields/getContentForCanonicalUrl';
import {getLang} from '/lib/app-metafields/getLang';
import {getMetaDescription} from '/lib/app-metafields/getMetaDescription';
import {getFullTitle} from '/lib/app-metafields/title/getFullTitle';
import {getPageTitle} from '/lib/app-metafields/title/getPageTitle';
import {getSiteConfigOrNullFromContentKey} from '/lib/app-metafields/xp/getSiteConfigOrNullFromContentKey';


export const buildContentMetaFieldsResolver = (graphQL: GraphQL): Resolver<
	{}, // args
	{}, // localContext
	Content,
	DataFetcherResult<ContentMetaFieldsResolverReturnType, {
		mergedConfigJson: string
		contentJson: string
		siteJson: string
	}>
> => (env) => {
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

	const {_path} = content;
	DEBUG && log.debug('contentMetaFieldsResolver _path:%s', _path);

	const {
		branch,
		project: projectName,
		// siteKey // NOTE: Can be undefined when x-guillotine-sitekey is missing
	} = localContext;
	DEBUG && log.debug('contentMetaFieldsResolver branch:%s', branch);
	const repository = `com.enonic.cms.${projectName}`;

	const context = getContext();
	DEBUG && log.debug('contentMetaFieldsResolver context:%s', toStr(context));

	const {
		authInfo: {
			principals
		}
	} = context;
	DEBUG && log.debug('contentMetaFieldsResolver principals:%s', toStr(principals));

	return runInContext({
		branch,
		repository,
		principals
	}, () => {
		const site: Site<MetafieldsSiteConfig>|null = getSiteByKey<MetafieldsSiteConfig>({ key: _path });
		DEBUG && log.debug('contentMetaFieldsResolver _path:%s site:%s', _path, toStr(site));

		// Return null when outside a site.
		if (!site) {
			return null;
		}

		const siteConfig = getSiteConfigOrNullFromContentKey(_path);
		DEBUG && log.debug('contentMetaFieldsResolver _path:%s siteSiteConfig:%s', _path, toStr(siteConfig));

		// Return null when app-metafields is not added to the site.
		if (!siteConfig) {
			return null;
		}

		const mergedConfig = getMergedConfig({siteConfig});
		DEBUG && log.debug('contentMetaFieldsResolver mergedConfig:%s', toStr(mergedConfig));

		const description = getMetaDescription({
			mergedConfig,
			content,
			site,
		});
		DEBUG && log.debug('contentMetaFieldsResolver description:%s', description);

		const pageTitle = getPageTitle({
			mergedConfig,
			content
		});

		const fullTitle = getFullTitle({
			mergedConfig,
			content,
			site,
		});
		DEBUG && log.debug('contentMetaFieldsResolver fullTitle:%s', fullTitle);

		const isFrontpage = site._path === _path;

		const blockRobots = mergedConfig.blockRobots || getBlockRobots(content)
		DEBUG && log.debug('contentMetaFieldsResolver blockRobots:%s', blockRobots);

		return graphQL.createDataFetcherResult<
			ContentMetaFieldsResolverReturnType,
			{
				mergedConfigJson: string
				contentJson: string
				siteJson: string
			}
		>({
			data: __.toScriptValue<ContentMetaFieldsResolverReturnType>({
				baseUrl: mergedConfig.baseUrl || null,
				canonical: getContentForCanonicalUrl(content),
				description,
				fullTitle,
				locale: getLang({
					content,
					site,
				}),
				openGraph: {
					hideImages: mergedConfig.removeOpenGraphImage,
					hideUrl: mergedConfig.removeOpenGraphUrl,
					type: isFrontpage ? 'website' : 'article', // TODO could be expanded to support more types, see https://ogp.me/
				},
				robots: {
					follow: !blockRobots,
					index: !blockRobots,
				},
				siteName: site.displayName,
				title: pageTitle,
				twitter: {
					hideImages: mergedConfig.removeTwitterImage,
					site: mergedConfig.twitterUsername,
				},
				verification: {
					google: mergedConfig.siteVerification || null
				},
			}),
			localContext: {
				mergedConfigJson: JSON.stringify(mergedConfig),
				contentJson: JSON.stringify(content),
				siteJson: JSON.stringify(site),
			},
			parentLocalContext: localContext
		});
	});
};
