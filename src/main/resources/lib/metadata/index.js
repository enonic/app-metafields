const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
    thymeleaf: require("/lib/thymeleaf"),
    common: require("/lib/common"),
};

const OG_ATTRIBUTE = "og: http://ogp.me/ns#";

function getMetaData(site, siteConfig, content=undefined, returnType="json", selfClosingTags=false) {   
    if (!content) {
        return undefined;
    }

    const appOrSiteConfig = libs.common.getTheConfig(site);

    const isFrontpage = site._path === content._path;
    const pageTitle = libs.common.getPageTitle(content, site);
    const siteVerification = siteConfig.siteVerification || null;

    let url = !appOrSiteConfig.removeOpenGraphUrl ?
        libs.portal.pageUrl({ path: content._path, type: "absolute" }) :
        null;
    const canonicalContent = libs.common.getContentForCanonicalUrl(content);
    const canonicalUrl = canonicalContent ?
        libs.portal.pageUrl({ path: canonicalContent._path, type: "absolute"}) :
         url;
    let fallbackImage = siteConfig.seoImage;
    let fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
    if (isFrontpage && siteConfig.frontpageImage) {
        fallbackImage = siteConfig.frontpageImage;
        fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
    }

    const imageUrl = !appOrSiteConfig.removeOpenGraphImage ?
        libs.common.getImage(content, site, fallbackImage, fallbackImageIsPrescaled) :
        null;

    const twitterImageUrl = !appOrSiteConfig.removeTwitterImage ?
        libs.common.getImage(content, site, fallbackImage) :
        null;

    const params = {
        title: pageTitle,
        description: libs.common.getMetaDescription(content, site),
        siteName: site.displayName,
        locale: libs.common.getLang(content, site),
        type: isFrontpage ? "website" : "article",
        url,
        canonicalUrl,
        imageUrl,
        imageWidth: 1200, // Twice of 600x315, for retina
        imageHeight: 630,
        blockRobots: siteConfig.blockRobots || libs.common.getBlockRobots(content),
        siteVerification,
        canonical: siteConfig.canonical,
        twitterUserName: appOrSiteConfig.twitterUsername,
        twitterImageUrl,
    };

    if (returnType === 'json') {
        return params;
    }

    if (returnType === 'html') {
        return resolveMetadata(params, selfClosingTags);
    }

    return undefined;
}

function getTitle(site, content=undefined) {
    if (!content) {
        return undefined;
    }

    const isFrontpage = site._path === content._path;
    const titleAppendix = libs.common.getAppendix(site, isFrontpage);
    const pageTitle = libs.common.getPageTitle(content, site);
    const titleHtml = "<title>" + pageTitle + titleAppendix + "</title>";

    return titleHtml;
}

function getFixedHtmlAttrsAsString(htmlTag) {
    const htmlIndex = htmlTag.toLowerCase().indexOf("<html");
    const endHtmlIndex = htmlTag.indexOf(">", htmlIndex);
    const htmlTagContents = htmlTag.substr(htmlIndex + 5, endHtmlIndex - htmlIndex - 5).trim();

    let htmlTagAttributes = htmlTagContents.split("=") || []; // Split on = so we can locate all the attributes.
    let prefixFound = false;

    for (let i = 0; i < htmlTagAttributes.length; i++) {
        if (htmlTagAttributes[i].toLowerCase().trim() === "prefix") {
            prefixFound = true;
            if (htmlTagAttributes[i + 1].indexOf(OG_ATTRIBUTE) === -1) {
                //log.info("Before join - " + htmlTagAttributes[i+1]);
                htmlTagAttributes[i + 1] =
                    htmlTagAttributes[i + 1].substr(
                        0,
                        htmlTagAttributes[i + 1].length - 1
                    ) +
                    " " +
                    OG_ATTRIBUTE +
                    htmlTagAttributes[i + 1].substr(-1);
                //log.info("After join - " + htmlTagAttributes[i+1]);
            } else {
                //log.info("Already in the tag!");
            }
        }
    }
    // Join the new html element string
    let innerHtmlTagText = htmlTagAttributes.join("=");

    if (!prefixFound) innerHtmlTagText += ' prefix="' + OG_ATTRIBUTE + '"';

    return innerHtmlTagText;
}

function getReusableData(contentPath=undefined) {
    let site, content, siteConfig;
    
    if (!contentPath) {
        site = libs.portal.getSite();
        content = libs.portal.getContent();
        siteConfig = libs.portal.getSiteConfig();
    } else {
        content = libs.content.get({ key: contentPath });
        site = libs.content.getSite({ key: contentPath });
        siteConfig = libs.content.getSiteConfig({ key: contentPath, applicationKey: app.name });
    }

    return { site, content, siteConfig };
}

module.exports = {
    getReusableData,
    getMetaData,
    getTitle,
    getFixedHtmlAttrsAsString
}

// Functions below module.exports are only used internally

function resolveMetadata(params, selfClosingTags=false) {
    return selfClosingTags
        ? libs.thymeleaf.render(resolve("metadata-self-closed.html"), params) 
        : libs.thymeleaf.render(resolve("metadata.html"), params);
}
