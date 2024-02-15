import type {Request, Response} from '/lib/types';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {
	getContent as getCurrentContent,
	getSite as libPortalGetSite,
} from '/lib/xp/portal';
import {getAppOrSiteConfig} from '/lib/common/getAppOrSiteConfig';
import {getFixedHtmlAttrsAsString} from '/lib/metadata/getFixedHtmlAttrsAsString';
import {getMetaData} from '/lib/metadata/getMetaData'
import {getTitleHtml} from '/lib/metadata/getTitleHtml';


const HTML_MEDIA_TYPE = 'text/html';
const XML_MEDIA_TYPES = ['application/xhtml+xml', 'application/xml', 'text/xml'];


export const responseProcessor = (req: Request, res: Response) => {
	const site = libPortalGetSite();
	const content = getCurrentContent();
	const appOrSiteConfig = getAppOrSiteConfig({
		applicationConfig: app.config, // NOTE: Using app.config is fine, since it's outside Guillotine Execution Context
		applicationKey: app.name, // NOTE: Using app.name is fine, since it's outside Guillotine Execution Context
		site
	});

	let titleAdded = false;
	const isResponseContentTypeHtml = res.contentType.indexOf(HTML_MEDIA_TYPE) > -1;
	const isResponseContentTypeXml = XML_MEDIA_TYPES.some(xmlMediaType => res.contentType.indexOf(xmlMediaType) > -1);

	if ( isResponseContentTypeHtml && res.body && typeof res.body === "string" ) {
		const titleHasIndex = res.body.indexOf("<title>") > -1;
		const htmlIndex = res.body.toLowerCase().indexOf("<html");
		const endHtmlIndex = res.body.indexOf(">", htmlIndex);

		// Handle injection of title - use any existing tag by replacing its content.
		// Svg are text/html can have a <title>
		if (titleHasIndex && htmlIndex > -1) {
			const titleHtml = getTitleHtml({
				appOrSiteConfig,
				content,
				site,
			}) || "";
			res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml);
			titleAdded = true;
		}

		// Locate the <html> tag and make sure the "og" namespace is added.
		if (htmlIndex >= 0 && endHtmlIndex >= 0) {
			const fixedHtmlTagInnerContent = getFixedHtmlAttrsAsString({
				htmlTag: res.body,
				isFrontpage: site._path === content._path,
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
			appOrSiteConfig,
			site,
			content,
			returnType: 'html',
			selfClosingTags
		}) as string || "";
		res.pageContributions.headEnd.push(metadata);
	}

	if ( !titleAdded ) {
		const titleHtml = getTitleHtml({
			appOrSiteConfig,
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
