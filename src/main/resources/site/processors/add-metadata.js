const libs = {
    portal: require("/lib/xp/portal"),
    util: require("/lib/util"),
    metadata: require("/lib/metadata")
};

const HTML_MEDIA_TYPE = 'text/html';
const XML_MEDIA_TYPES = ['application/xhtml+xml', 'application/xml', 'text/xml'];

exports.responseProcessor = function (req, res) {
    const reusableData = libs.metadata.getReusableData();
    const site = reusableData.site;
    const content = reusableData.content;
    const siteConfig = reusableData.siteConfig;

    // Avoid page processor if the app is set to headless mode
    if ( siteConfig.headless ) {
        return res;
    }

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
            const titleHtml = libs.metadata.getTitle(site, content) || "";
            res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml);
            titleAdded = true;
        }

        // Locate the <html> tag and make sure the "og" namespace is added.
        if (htmlIndex >= 0 && endHtmlIndex >= 0) {
            const fixedHtmlTagInnerContent = libs.metadata.getFixedHtmlAttrsAsString(res.body);
            res.body = res.body.substr(0, htmlIndex + 5) + " " + fixedHtmlTagInnerContent + res.body.substr(endHtmlIndex);
        }
    }

    // Force arrays since single values will be return as string instead of array
    res.pageContributions.headEnd = libs.util.data.forceArray(res.pageContributions.headEnd);

    // Push metadata if response content type is html or xml
    if ( isResponseContentTypeHtml || isResponseContentTypeXml ) {
        const selfClosingTags = isResponseContentTypeXml;
        const metadata = libs.metadata.getMetaData(site, siteConfig, content, "html", selfClosingTags) || "";
        res.pageContributions.headEnd.push(metadata);
    }

    if ( !titleAdded ) {
        const titleHtml = libs.metadata.getTitle(site, content) || "";
        res.pageContributions.headEnd.push(titleHtml);
    }

    // Skip other filters
    if ( req.params && req.params.debug === "true" ) {
        res.applyFilters = false; 
    }

    return res;
};
