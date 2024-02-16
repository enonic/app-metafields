import type {Content, Site} from '/lib/xp/content';

import type {
	// Content,
	Resolver
} from '/lib/app-metafields/types/guillotine';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types';


import {toStr} from '@enonic/js-utils/value/toStr';
import {get as getContentByKey} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';

import {DEBUG} from '/lib/app-metafields/constants';
import {getImageId} from '/lib/app-metafields/image/getImageId';


export const metaFieldsImagesResolver: Resolver<
	{}, // args
	{ // source
		_appOrSiteConfig: MetafieldsSiteConfig
		_content: Content
		_siteOrNull: Site<MetafieldsSiteConfig>|null
	}
> = (env) => {
	DEBUG && log.debug('metaFieldsImagesResolver env:%s', toStr(env));

	const {
		// args,
		localContext,
		source
	} = env;

	const {
		branch,
		project,
		// siteKey // NOTE: Can be undefined when x-guillotine-sitekey is missing
	} = localContext;

	const {
		_appOrSiteConfig,
		_content,
		_siteOrNull,
	} = source;

	const context = getContext();
	DEBUG && log.debug('metaFieldsImagesResolver context: %s', toStr(context));

	const {
		authInfo: {
			// user: { // NOTE: Can be undefined when not logged in
			// 	login: userLogin,
			// 	idProvider: userIdProvider
			// },
			principals
		}
	} = context;
	DEBUG && log.debug('metaFieldsImagesResolver principals:%s', toStr(principals));

	return runInContext({
		branch,
		repository: `com.enonic.cms.${project}`,
		// user: {
		// 	idProvider: userIdProvider,
		// 	login: userLogin,
		// },
		principals
	}, () => {

		const imageId = getImageId({
			appOrSiteConfig: _appOrSiteConfig,
			content: _content,
			siteOrNull: _siteOrNull,
		});
		if (imageId) {
			const imageContent = getContentByKey({ key: imageId });
			if (imageContent) {
				return imageContent;
			} else {
				if (_siteOrNull) {
					log.error(`content with path:${_content._path} or site with path: ${_siteOrNull?._path} references a non-existing image with key:${imageId}`);
				} else {
					log.error(`content with path:${_content._path} references a non-existing image with key:${imageId}`);
				}
			}
		}

		return null;
	});
}
