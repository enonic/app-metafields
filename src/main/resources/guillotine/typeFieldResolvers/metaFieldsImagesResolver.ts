import type {Content, Site} from '/lib/xp/content';

import type {
	// Content,
	Resolver
} from '/lib/types/guillotine';
import type {MetafieldsSiteConfig} from '/lib/types';


import {get as getContentByKey} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';
import {commaStringToArray} from '/lib/common/commaStringToArray';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {getImageId} from '/lib/common/getImageId';


export const metaFieldsImagesResolver: Resolver<
	{}, // args
	{ // source
		_content: Content
		_site: Site<MetafieldsSiteConfig>
		_siteConfig: MetafieldsSiteConfig
	}
> = (env) => {
	// log.info(`resolvers content metafields ${JSON.stringify(env, null, 4)}`);
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
		_content,
		_site,
		_siteConfig
	} = source;
	const context = getContext();
	// log.info('metaFieldsImagesResolver context: %s', JSON.stringify(context, null, 4));
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

		const imageId = getImageId({
			content: _content,
			site: _site,
			siteConfig: _siteConfig
		});
		if (imageId) {
			const imageContent = getContentByKey({ key: imageId });
			if (imageContent) {
				return imageContent;
			} else {
				log.error(`content with path:${_content._path} or site with path: ${_site._path} references a non-existing image with key:${imageId}`);
			}
		}

		return null;
	});
}
