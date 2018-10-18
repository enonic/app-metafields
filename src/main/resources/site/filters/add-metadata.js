var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util'),
    local: require('/lib/local')
};

var view = resolve('add-metadata.html');

exports.responseFilter = function(req, res) {
    var site = libs.portal.getSite();
    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    var isFrontpage = site._path === content._path;
    var pageTitle = libs.local.getPageTitle(content, site);
    var titleAppendix = libs.local.getAppendix(site, isFrontpage);

    var siteVerification = siteConfig.siteVerification || null;

    var url = libs.portal.pageUrl({ path: content._path, type: "absolute" });
    var fallbackImage = siteConfig.seoImage;
    var fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
    if (isFrontpage && siteConfig.frontpageImage) {
        fallbackImage = siteConfig.frontpageImage;
        fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
    }
    var image = libs.local.getOpenGraphImage(content, site, fallbackImage, fallbackImageIsPrescaled);

    var params = {
        title: pageTitle,
        description: libs.local.getMetaDescription(content, site),
        siteName: site.displayName,
        locale: libs.local.getLang(content,site),
        type: isFrontpage ? 'website' : 'article',
        url: url,
        image: image,
        imageWidth: 1200, // Twice of 600x315, for retina
        imageHeight: 630,
        blockRobots: siteConfig.blockRobots || libs.local.getBlockRobots(content),
        siteVerification: siteVerification,
        canonical: siteConfig.canonical,
        twitterUserName : siteConfig.twitterUsername

    };

    var metadata = libs.thymeleaf.render(view, params);

    // Force arrays since single values will be return as string instead of array
    res.pageContributions.headEnd = libs.util.data.forceArray(res.pageContributions.headEnd);
    res.pageContributions.headEnd.push(metadata);

    // Handle injection of title - use any existing tag by replacing its content.
    var titleHtml = '<title>' + pageTitle + titleAppendix + '</title>';
    var titleAdded = false;
    if (res.contentType === 'text/html') {
         if (res.body) {
            if (typeof res.body === 'string') {
                // Find a title in the html and use that instead of adding our own title
                var hasIndex = res.body.indexOf('<title>') > -1;
                if (hasIndex) {
                    res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml);
                    titleAdded = true;
                }
            }
        }
    }
    if (!titleAdded) {
        res.pageContributions.headEnd.push(titleHtml);
    }

    if (req.params) {
        if (req.params.debug === 'true') {
            res.applyFilters = false; // Skip other filters
        }
     }

    return res;
};
