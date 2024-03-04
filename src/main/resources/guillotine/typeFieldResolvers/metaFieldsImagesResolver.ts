import type {Resolver} from '@enonic-types/guillotine';
import type {
	ContentMetaFieldsResolverReturnType,
	MetaFieldsImagesResolverReturnType
} from '/guillotine/guillotine.d';


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
	{
		mergedConfigJson: string
		contentJson: string
		siteJson: string
	}, // localContext
	ContentMetaFieldsResolverReturnType,
	MetaFieldsImagesResolverReturnType
> = (env) => {
	DEBUG && log.debug('metaFieldsImagesResolver env:%s', toStr(env));

	const {
		// args,
		localContext,
		// source
	} = env;

	const {
		mergedConfigJson,
		branch,
		contentJson,
		project: projectName,
		// siteKey // NOTE: Can be undefined when x-guillotine-sitekey is missing
		siteJson,
	} = localContext;

	const mergedConfig = JSON.parse(mergedConfigJson);
	const content = JSON.parse(contentJson);
	const site = JSON.parse(siteJson);

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
		repository: `com.enonic.cms.${projectName}`,
		// user: {
		// 	idProvider: userIdProvider,
		// 	login: userLogin,
		// },
		principals
	}, () => {

		const imageId = getImageId({
			mergedConfig,
			content,
			site,
		});
		if (imageId) {
			const imageContent = getContentByKey({ key: imageId });
			if (imageContent) {
				return imageContent as MetaFieldsImagesResolverReturnType;
			} else {
				log.error(`content with path:${content._path} or site with path: ${site._path} or application config references a non-existing image with key:${imageId}`);
			}
		}

		return null as MetaFieldsImagesResolverReturnType;
	});
}
