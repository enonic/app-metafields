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


export function findImageIdInContent({
	mergedConfig,
	content,
}: {
	mergedConfig: MetafieldsSiteConfig
	content: Content
}): ImageId|null {
	DEBUG && log.debug('findImageIdInContent content: %s', toStr(content));

	if(content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoImage) {
		return content.x[APP_NAME_PATH][MIXIN_PATH].seoImage as ImageId;
	}

	const userDefinedPaths = mergedConfig.pathsImages || '';
	DEBUG && log.debug('findImageIdInContent userDefinedPaths: %s', userDefinedPaths);

	const userDefinedArray = userDefinedPaths ? oneOrMoreCommaStringToArray(userDefinedPaths) : [];
	DEBUG && log.debug('findImageIdInContent userDefinedArray: %s', toStr(userDefinedArray));

	const userDefinedValue = userDefinedPaths ? findValueInObject(content, userDefinedArray, mergedConfig.fullPath) : null;
	DEBUG && log.debug('findImageIdInContent userDefinedValue: %s', userDefinedValue);

	const firstItem = forceArray(userDefinedValue)[0];

	const hopefullyString = firstItem?.image || firstItem;

	if (isString(hopefullyString)) {
		return hopefullyString as ImageId;
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
		return hits[0]._id as ImageId;
	}

	return null;
}
