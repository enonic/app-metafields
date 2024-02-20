import type {Content} from '/lib/xp/content';
import type {ImageId} from '/lib/app-metafields/types';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {toStr} from '@enonic/js-utils/value/toStr';
import {
	getOutboundDependencies,
	query as queryContent
} from '/lib/xp/content';
import {oneOrMoreCommaStringToArray} from '/lib/app-metafields/string/oneOrMoreCommaStringToArray';
import {APP_NAME_PATH, DEBUG, MIXIN_PATH} from '/lib/app-metafields/constants';
import {findValueInObject} from '/lib/app-metafields/object/findValueInObject';
import {isString} from '/lib/app-metafields/string/isString';
import {ImageIdBuilder} from '/lib/app-metafields/types';


export function findImageIdInContent({
	appOrSiteConfig,
	content,
}: {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
}): ImageId|null {
	DEBUG && log.debug('findImageIdInContent content: %s', toStr(content));

	if(content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoImage) {
		return ImageIdBuilder.from(content.x[APP_NAME_PATH][MIXIN_PATH].seoImage as string);
	}

	const userDefinedPaths = appOrSiteConfig.pathsImages || '';
	DEBUG && log.debug('findImageIdInContent userDefinedPaths: %s', userDefinedPaths);

	const userDefinedArray = userDefinedPaths ? oneOrMoreCommaStringToArray(userDefinedPaths) : [];
	DEBUG && log.debug('findImageIdInContent userDefinedArray: %s', toStr(userDefinedArray));

	const userDefinedValue = userDefinedPaths ? findValueInObject(content, userDefinedArray, appOrSiteConfig.fullPath) : null;
	DEBUG && log.debug('findImageIdInContent userDefinedValue: %s', userDefinedValue);

	const firstItem = forceArray(userDefinedValue)[0];

	const hopefullyString = firstItem?.image || firstItem;

	if (isString(hopefullyString)) {
		return ImageIdBuilder.from(hopefullyString);
	}

	const {type} = content;

	// On the site, using outboundDependencies is a bad idea since siteConfig
	// from various apps may contains images
	if (type === 'portal:site') {
		DEBUG && log.debug("findImageIdInContent: Didn't find any image on site: %s", content._path);
		return null
	}

	const outboundDependencies = getOutboundDependencies({
		key: content._id
	});
	if (!outboundDependencies?.length) {
		return null;
	}
	DEBUG && log.debug('findImageIdInContent outboundDependencies:%s', toStr(outboundDependencies));

	const contentQueryParams = {
		contentTypes: ['media:image'],
		count: 1,
		filters: {
			boolean: {
				must: {
					ids: {
						values: outboundDependencies
					}
				},
			}
		},
	};
	DEBUG && log.debug('findImageIdInContent contentQueryParams:%s', toStr(contentQueryParams));

	const contentQueryRes = queryContent(contentQueryParams);
	DEBUG && log.debug('findImageIdInContent contentQueryRes:%s', toStr(contentQueryRes));

	const {hits} = contentQueryRes;
	if (hits.length) {
		return ImageIdBuilder.from(hits[0]._id);
	}

	return null;
}
