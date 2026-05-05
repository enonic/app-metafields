import type {Request, Response} from '/lib/app-metafields/types';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {toStr} from '@enonic/js-utils/value/toStr';
import {
	getContent as getCurrentContent,
	getSite as libPortalGetSite,
	getSiteConfig as libPortalGetSiteConfig,
} from '/lib/xp/portal';
import {DEBUG, TRACE} from '/lib/app-metafields/constants';
import {getMergedConfig} from '/lib/app-metafields/xp/getMergedConfig';
import {getFixedHtmlAttrsAsString} from '/lib/app-metafields/processor/getFixedHtmlAttrsAsString';
import {getMetaData} from '/lib/app-metafields/processor/getMetaData'
import {getTitleHtml} from '/lib/app-metafields/processor/getTitleHtml';


const HTML_MEDIA_TYPE = 'text/html';
const XML_MEDIA_TYPES = ['application/xhtml+xml', 'application/xml', 'text/xml'];


export const responseProcessor = (req: Request, res: Response) => {
	DEBUG && log.debug('add-metadata response processor Request:%s Response:%s', toStr(req), toStr(res));

	const content = getCurrentContent();
	DEBUG && log.debug('add-metadata response processor Content:%s', toStr(content));

	const site = libPortalGetSite();
	DEBUG && log.debug('add-metadata response processor Site:%s', toStr(content));

	const siteConfig = libPortalGetSiteConfig();
	DEBUG && log.debug('add-metadata response processor siteConfig:%s', toStr(siteConfig));

	const mergedConfig = getMergedConfig({siteConfig});

	let titleAdded = false;
	const isResponseContentTypeHtml = res.contentType.indexOf(HTML_MEDIA_TYPE) > -1;
	TRACE && log.debug('add-metadata response processor isResponseContentTypeHtml:%s', isResponseContentTypeHtml);

	const isResponseContentTypeXml = XML_MEDIA_TYPES.some(xmlMediaType => res.contentType.indexOf(xmlMediaType) > -1);

	if ( isResponseContentTypeHtml && res.body && typeof res.body === "string" ) {
		const titleHasIndex = res.body.indexOf("<title>") > -1;
		const htmlIndex = res.body.toLowerCase().indexOf("<html");
		const endHtmlIndex = res.body.indexOf(">", htmlIndex);

		// Handle injection of title - use any existing tag by replacing its content.
		// Svg are text/html can have a <title>
		if (titleHasIndex && htmlIndex > -1) {
			const titleHtml = getTitleHtml({
				mergedConfig,
				content,
				site,
			}) || '';
			TRACE && log.debug('add-metadata response processor titleHtml:%s', titleHtml);
			res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml);
			titleAdded = true;
		}

		// Locate the <html> tag and make sure the "og" namespace is added.
		if (htmlIndex >= 0 && endHtmlIndex >= 0) {
			const fixedHtmlTagInnerContent = getFixedHtmlAttrsAsString({
				htmlTag: res.body,
				isFrontpage: site && content && site._path === content._path,
			});
			res.body = res.body.substr(0, htmlIndex + 5) + " " + fixedHtmlTagInnerContent + res.body.substr(endHtmlIndex);
		}
	}

	// Force arrays since single values will be return as string instead of array
	res.pageContributions.headEnd = forceArray(res.pageContributions.headEnd);

	// Push metadata if response content type is html or xml
	if ( isResponseContentTypeHtml || isResponseContentTypeXml ) {
		const selfClosingTags = isResponseContentTypeXml;
		const metadata: string = getMetaData({
			mergedConfig,
			content,
			returnType: 'html',
			selfClosingTags,
			site,
		}) as string || "";
		res.pageContributions.headEnd.push(metadata);
	}

	if ( !titleAdded ) {
		const titleHtml = getTitleHtml({
			mergedConfig,
			content,
			site,
		}) || "";
		res.pageContributions.headEnd.push(titleHtml);
	}

	// Skip other filters
	if ( req.params && req.params.debug === "true" ) {
		res.applyFilters = false;
	}

	return res;
};
