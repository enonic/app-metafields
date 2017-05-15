var libs = {
    portal: require('/lib/xp/portal'),
    thymeleaf: require('/lib/xp/thymeleaf'),
    util: require('/lib/enonic/util'),
    site: require('/lib/site')
};

var view = resolve('add-metadata.html');

// Format locale into the ISO format that Open Graph wants
var localeMap = {
    da: 'da_DK',
    sv: 'sv_SE',
    pl: 'pl_PL',
    no: 'nb_NO',
    en: 'en_US'
};

exports.responseFilter = function(req, res) {
    var site = libs.portal.getSite();
    var content = libs.portal.getContent();
    var siteConfig = libs.portal.getSiteConfig();

    var lang = content.language || site.language || 'en';
    var frontpage = site._path === content._path;
    var pageTitle = libs.site.getPageTitle(content, site);

    // Concat site title?
    var titleAppendix = '';
    if (siteConfig.titleBehaviour) {
        var separator = siteConfig.titleSeparator || '-';
        if (!frontpage || !siteConfig.titleFrontpageBehaviour) {
            titleAppendix = ' ' + separator + ' ' + site.displayName;
        }
    }

	 var siteVerification = siteConfig.siteVerification || null;

    var params = {
        title: pageTitle,
        description: libs.site.getMetaDescription(content, site),
        siteName: site.displayName,
        locale: localeMap[lang] || localeMap.en,
        type: site._path === content._path ? 'website' : 'article',
        url: libs.portal.pageUrl({ path: content._path, type: "absolute" }),
        image: libs.site.getOpenGraphImage(content, siteConfig.seoImage),
        imageWidth: 1200, // Twice of 600x315, for retina
        imageHeight: 630,
        blockRobots: siteConfig.blockRobots || libs.site.getBlockRobots(content),
        siteVerification: siteVerification,
        canonical: siteConfig.canonical,
        twitterUserName : siteConfig.twitterUsername

    };

    var metadata = libs.thymeleaf.render(view, params);

    // Force arrays since single values will be return as string instead of array
    res.pageContributions.headEnd = libs.util.data.forceArray(res.pageContributions.headEnd);
    res.pageContributions.headEnd.push(metadata);

    // Handle injection of title - use any existing tag by replacing its content.
    var title = '<title>' + pageTitle + titleAppendix + '</title>';
    var titleAdded = false;
    if (res.contentType === 'text/html') {
         if (res.body) {
            if (typeof res.body === 'string') {
                // Find a title in the html and use that instead of adding our own title
                var hasIndex = res.body.indexOf('<title>') > -1;
                if (hasIndex) {
                    res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, title);
                    titleAdded = true;
                }
            }
        }
    }
    if (!titleAdded) {
        res.pageContributions.headEnd.push(title);
    }

    if (req.params) {
	    if (req.params.debug === 'true') {
	        res.applyFilters = false; // Skip other filters
	    }
	 }

    return res;
};
