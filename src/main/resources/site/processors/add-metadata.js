const libs = {
    portal: require("/lib/xp/portal"),
    util: require("/lib/util"),
    metadata: require("/lib/metadata")
};

exports.responseProcessor = function (req, res) {
    const reusableData = libs.metadata.getReusableData();
    const site = reusableData.site;
    const content = reusableData.content;
    const siteConfig = reusableData.siteConfig;

    // Avoid page processor if the app is set to headless mode
    if (siteConfig.headless) return res;

    const metadata = libs.metadata.getMetaData(site, siteConfig, content, "html") || "";

    // Force arrays since single values will be return as string instead of array
    res.pageContributions.headEnd = libs.util.data.forceArray(res.pageContributions.headEnd);

    // Push metadata
    res.pageContributions.headEnd.push(metadata);

    // Handle injection of title - use any existing tag by replacing its content.
    // Also - Locate the <html> tag and make sure the "og" namespace is added.
    const titleHtml = libs.metadata.getTitle(site, content) || "";

    let titleAdded = false;

    if (
        res.contentType.indexOf("text/html") > -1 &&
        res.body &&
        typeof res.body === "string"
    ) {
        // Find a title in the html and use that instead of adding our own title
        const titleHasIndex = res.body.indexOf("<title>") > -1;
        const htmlIndex = res.body.toLowerCase().indexOf("<html");
        const endHtmlIndex = res.body.indexOf(">", htmlIndex);

        // Svg are text/html can have a <title>
        if (titleHasIndex && htmlIndex > -1) {
            res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml); //REPLACE ALL TITLES!
            titleAdded = true;
        }

        // Find <html> and if it does not have proper "og"-prefix - inject it!
        const fixedHtmlTagInnerContent = libs.metadata.getFixedHtmlAttrsAsString(res.body);

        res.body = 
            res.body.substr(0, htmlIndex + 5) +
            " " +
            fixedHtmlTagInnerContent +
            res.body.substr(endHtmlIndex);
    }

    if (!titleAdded) {
        res.pageContributions.headEnd.push(titleHtml);
    }

    if (req.params) {
        if (req.params.debug === "true") {
            res.applyFilters = false; // Skip other filters
        }
    }

    return res;
};
