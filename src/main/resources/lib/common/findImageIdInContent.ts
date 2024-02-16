import type {Content} from '/lib/xp/content';
import type {ImageId} from '/lib/types';
import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {
	getOutboundDependencies,
	query as queryContent
} from '/lib/xp/content';
import {oneOrMoreCommaStringToArray} from '/lib/app-metafields/string/oneOrMoreCommaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findValueInObject} from '/lib/common/findValueInObject';
import {isString} from '/lib/common/isString';
import {
	CommaSeparatedStringBuilder,
	ImageIdBuilder,
} from '/lib/types';


export function findImageIdInContent({
	appOrSiteConfig,
	content,
}: {
	appOrSiteConfig: MetafieldsSiteConfig
	content: Content
}): ImageId|undefined {
	if(content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoImage) {
		return ImageIdBuilder.from(content.x[APP_NAME_PATH][MIXIN_PATH].seoImage as string);
	}

	const userDefinedPaths = CommaSeparatedStringBuilder.from(appOrSiteConfig.pathsImages || '');
	const userDefinedArray = userDefinedPaths ? oneOrMoreCommaStringToArray(userDefinedPaths) : [];
	const userDefinedValue = userDefinedPaths ? findValueInObject(content, userDefinedArray, appOrSiteConfig.fullPath) : null;

	const firstItem = forceArray(userDefinedValue)[0];

	const hopefullyString = firstItem?.image || firstItem;

	if (isString(hopefullyString)) {
		return ImageIdBuilder.from(hopefullyString);
	}

	const {type} = content;

	// On the site, using outboundDependencies is a bad idea since siteConfig
	// from various apps may contains images
	if (type === 'portal:site') {
		// log.info(`findImageIdInContent: Didn't find any image on site ${content._path}`);
		return undefined
	}

	const outboundDependencies = getOutboundDependencies({
		key: content._id
	});
	if (!outboundDependencies?.length) {
		return undefined;
	}
	// log.info('findImageIdInContent outboundDependencies:%s', JSON.stringify(outboundDependencies, null, 4));

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
	// log.info('findImageIdInContent contentQueryParams:%s', JSON.stringify(contentQueryParams, null, 4));

	const contentQueryRes = queryContent(contentQueryParams);
	// log.info('findImageIdInContent contentQueryRes:%s', JSON.stringify(contentQueryRes, null, 4));

	const {hits} = contentQueryRes;
	if (hits.length) {
		return ImageIdBuilder.from(hits[0]._id);
	}

	return undefined;
}
