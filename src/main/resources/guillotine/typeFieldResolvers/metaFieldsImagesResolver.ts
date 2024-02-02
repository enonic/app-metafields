import type {Content} from '/lib/xp/content';

import type {
	// Content,
	Resolver
} from '/guillotine/guillotine.d';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig.d';


import {get as getContentByKey} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';
import {commaStringToArray} from '/lib/common/commaStringToArray';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';


export const metaFieldsImagesResolver: Resolver<
	{}, // args
	{ // source
		_content: Content
		_site: Record<string, unknown>
		_siteConfig: MetafieldsSiteConfig
		// images: string[]
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

		const images = [];
		if (_siteConfig.seoImage) {
			const imageContent = getContentByKey({ key: _siteConfig.seoImage });
			if (imageContent) {
				images.push(imageContent);
			} else {
				log.error(`_siteConfig.seoImage for site with _path:${_site._path} references a non-existing image with key:${_siteConfig.seoImage}`);
			}
		} else {
			// Try to find image contentKey in content
			const userDefinedPaths = _siteConfig.pathsImages || '';
			const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
			const userDefinedValue = userDefinedPaths ? findStringValueInObject(_content, userDefinedArray, _siteConfig.fullPath) : null;
			if (userDefinedValue) {
				const imageContent = getContentByKey({ key: userDefinedValue });
				if (imageContent) {
					images.push(imageContent);
				} else {
					log.error(`content with _path:${_content._path} references a non-existing image with key:${userDefinedValue}}`);
				}
			} else {
				if (_content.data.image) {
					const imageContent = getContentByKey({ key: _content.data.image as string });
					if (imageContent) {
						images.push(imageContent);
					} else {
						log.error(`content with _path:${_content._path} references a non-existing image with key:${_content.data.image}}`);
					}
				} else if (_content.data.images) {
					const imageContent = getContentByKey({ key: _content.data.images as string });
					if (imageContent) {
						images.push(imageContent);
					} else {
						log.error(`content with _path:${_content._path} references a non-existing image with key:${_content.data.images}}`);
					}
				}
			}
		}
		if (_siteConfig.frontpageImage) {
			const imageContent = getContentByKey({ key: _siteConfig.frontpageImage });
			if (imageContent) {
				images.push(imageContent);
			} else {
				log.error(`siteConfig.frontpageImage for site with _path:${_site._path} references a non-existing image with key:${_siteConfig.frontpageImage}`);
			}
		}
		return images;
	});
}
