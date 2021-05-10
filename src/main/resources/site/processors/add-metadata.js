const libs = {
  portal: require('/lib/xp/portal'),
  util: require('/lib/util'),
  common: require('/lib/common'),
  cache: require('/lib/cache')
};

const renderTemplate = (model) => `
${model.blockRobots ? `<meta name="robots" content="noindex,nofollow" />` : ""}
${model.canonical ? `<link rel="canonical" href="${model.url}" />` : ""}
${model.siteVerification ? `<meta name="google-site-verification" content="${model.siteVerification}" />` : ""}
<meta name="description" content="${model.description}" />
<meta property="og:title" content="${model.title}" />
<meta property="og:description" content="${model.description}" />
<meta property="og:site_name" content="${model.siteName}" />
<meta property="og:url" content="${model.url}" />
<meta property="og:type" content="${model.type}" />
<meta property="og:locale" content="${model.locale}" />
${model.image ? `
<meta property="og:image" content="${model.image}" />
<meta property="og:image:width" content="${model.imageWidth}" />
<meta property="og:image:height" content="${model.imageHeight}" />
` : ""}
${model.twitterUserName ? `
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${model.title}" />
<meta name="twitter:description" content="${model.description}"/>
${model.image ? `
<meta name="twitter:image:src" content="${model.image}"/>
` : ""}
<meta name="twitter:site" content="${model.twitterUserName}"/>
` : ""}
`;

const ogAttribute = 'og: http://ogp.me/ns#';
const injectAttribute = (match, p1) => {
  const htmlTag = match;
  if (p1 && p1.length > 0) {
    const prefixIndex = p1.indexOf("prefix=");
    if (prefixIndex !== -1) {
      htmlTag.replace(/prefix=\"([^"]*)"/, (match, p1) => {
        if (p1 && p1.indexOf(ogAttribute) === -1) {
          return `prefix="${p1} ${ogAttribute}"`
        }
        return match;
      });
      return htmlTag;
    }
  }
  return `<html${p1 || ""} prefix="${ogAttribute}">`;
};

const siteConfigCache = libs.cache.newCache({
  size: 20,
  expire: 10 * 60 // 10 minute cache
});

exports.responseProcessor = (req, res) => {
  const site = libs.portal.getSite();
  const content = libs.portal.getContent();
  const siteConfig = siteConfigCache.get(`${site._path}_${req.branch}`, () => libs.common.getTheConfig(site));

  const isFrontpage = site._path === content._path;
  const pageTitle = libs.common.getPageTitle(content, site, siteConfig);
  const titleAppendix = libs.common.getAppendix(site, isFrontpage, siteConfig);

  const siteVerification = siteConfig.siteVerification || null;

  const url = libs.portal.pageUrl({ path: content._path, type: "absolute" });
  let fallbackImage = siteConfig.seoImage;
  let fallbackImageIsPrescaled = siteConfig.seoImageIsPrescaled;
  if (isFrontpage && siteConfig.frontpageImage) {
    fallbackImage = siteConfig.frontpageImage;
    fallbackImageIsPrescaled = siteConfig.frontpageImageIsPrescaled;
  }
  const image = libs.common.getOpenGraphImage(content, site, fallbackImage, fallbackImageIsPrescaled);

  const params = {
    title: pageTitle,
    description: libs.common.getMetaDescription(content, site),
    siteName: site.displayName,
    locale: libs.common.getLang(content, site),
    type: isFrontpage ? 'website' : 'article',
    url: url,
    image: image,
    imageWidth: 1200, // Twice of 600x315, for retina
    imageHeight: 630,
    blockRobots: siteConfig.blockRobots || libs.common.getBlockRobots(content),
    siteVerification: siteVerification,
    canonical: siteConfig.canonical,
    twitterUserName: siteConfig.twitterUsername
  };

  const metadata = renderTemplate(params);

  // Force arrays since single values will be return as string instead of array
  res.pageContributions.headEnd = libs.util.data.forceArray(res.pageContributions.headEnd);
  res.pageContributions.headEnd.push(metadata);

  // Handle injection of title - use any existing tag by replacing its content.
  // Also - Locate the <html> tag and make sure the "og" namespace is added.
  const titleHtml = '<title>' + pageTitle + titleAppendix + '</title>';
  let titleAdded = false;
  if (res.contentType === 'text/html') {
    if (res.body) {
      if (typeof res.body === 'string') {
        // Find a title in the html and use that instead of adding our own title
        const titleHasIndex = res.body.indexOf('<title>') > -1;
        if (titleHasIndex) {
          res.body = res.body.replace(/(<title>)(.*?)(<\/title>)/i, titleHtml);
          titleAdded = true;
        }

        // Find <html> and if it does not have proper "og"-prefix - inject it!
        res.body = res.body.replace(/<html(.*?[^?])?>/i, injectAttribute);
      }
    }
  }
  if (!titleAdded) {
    res.pageContributions.headEnd.push(titleHtml);
  }

  if (req.params && req.params.debug === 'true') {
    res.applyFilters = false; // Skip other filters
  }

  return res;
};
