const libs = {
  portal: require('/lib/xp/portal'),
  content: require('/lib/xp/content'),
  util: require('/lib/util')
};

const appNamePath = libs.util.app.getJsonName();
const mixinPath = 'meta-data';

const isString = (o) => {
  return typeof o === 'string' || o instanceof String;
};

const stringOrNull = (o) => {
  return isString(o) ? o : null;
};

// The configuration needs to be fetched first from site config (using current content if site context is not available - like for widgets), and lastly we'll check for any config files and use these to overwrite.
exports.getTheConfig = (site) => {
  let config = libs.portal.getSiteConfig();
  if (!config) {
    config = exports.getSiteConfig(site, app.name);
  }
  if (app.config && !config.disableAppConfig) {
    for (const prop in app.config) {
      let value = app.config[prop];
      if (prop !== 'config.filename' && prop !== 'service.pid') { // Default props for .cfg-files, not to use further.
        if (value === 'true' || value === 'false') {
          value = value === 'true';
        }
        config[prop] = value;
      }
    }
  }
  return config;
};

exports.getLang = (content, site) => {
  // Format locale into the ISO format that Open Graph wants.
  const localeMap = {
    da: 'da_DK',
    sv: 'sv_SE',
    pl: 'pl_PL',
    no: 'nb_NO',
    en: 'en_US'
  };
  const lang = content.language || site.language || 'en';
  return localeMap[lang] || localeMap.en
};

exports.getSite = (siteUrl) => {
  // Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
  const sitesResult = libs.content.query({
    query: "_path LIKE '/content/*' AND _name LIKE '" + siteUrl + "' AND data.siteConfig.applicationKey = '" + app.name + "'",
    contentTypes: ["portal:site"]
  });
  return sitesResult.hits[0];
};

// Find the site config even when the context is not known.
exports.getSiteConfig = (site, applicationKey) => {
  // Code courtesy of PVMerlo at Enonic Discuss - https://discuss.enonic.com/u/PVMerlo
  if (site) {
    if (site.data) {
      if (site.data.siteConfig) {
        const siteConfigs = libs.util.data.forceArray(site.data.siteConfig);
        let siteConfig = {};
        siteConfigs.forEach((cfg) => {
          if (applicationKey && cfg.applicationKey == applicationKey) {
            siteConfig = cfg;
          } else if (!applicationKey && cfg.applicationKey == app.name) {
            siteConfig = cfg;
          }
        });
        return siteConfig.config;
      }
    }
  }
};

const findValueInJson = (json, paths) => {
  let value = null;
  const pathLength = paths.length;

  for (let i = 0; i < pathLength; i++) {
    if (paths[i]) {
      try {
        value = paths[i].split('.').reduce((o, i) => o ? o[i] : null, json);
      } catch (e) {
        // Noop
      }

      if (value) {
        if (isString(value) && value.trim() === "") {
          value = null; // Reset value if empty string (skip empties)
        } else {
          break; // Expect the first property in the string is the most important one to use
        }
      } // if value
    } // if paths[i]
  } // for
  return value;
}; // function findValueInJson

// Concat site title? Trigger if set to true in settings, or if not set at all (default = true)
exports.getAppendix = (site, isFrontpage, siteConfig) => {
  let titleAppendix = '';
  if (siteConfig.titleBehaviour || !siteConfig.hasOwnProperty("titleBehaviour")) {
    const separator = siteConfig.titleSeparator || '-';
    const titleRemoveOnFrontpage = siteConfig.hasOwnProperty("titleFrontpageBehaviour") ? siteConfig.titleFrontpageBehaviour : true; // Default true needs to be respected
    if (!isFrontpage || !titleRemoveOnFrontpage) {
      titleAppendix = ' ' + separator + ' ' + site.displayName;
    }
  }
  return titleAppendix;
};

exports.getBlockRobots = (content) => {
  const setWithMixin = content.x[appNamePath]
    && content.x[appNamePath][mixinPath]
    && content.x[appNamePath][mixinPath].blockRobots;
  return setWithMixin;
};

exports.getPageTitle = (content, site, siteConfig) => {
  const userDefinedPaths = siteConfig.pathsTitles || '';
  const userDefinedArray = libs.util.data.forceArray(userDefinedPaths)
  const userDefinedValue = userDefinedPaths ? findValueInJson(content, userDefinedArray) : null;

  const setWithMixin = content.x[appNamePath]
    && content.x[appNamePath][mixinPath]
    && content.x[appNamePath][mixinPath].seoTitle;

  const metaTitle = setWithMixin ? stringOrNull(content.x[appNamePath][mixinPath].seoTitle) // Get from mixin
    : stringOrNull(userDefinedValue) // json property defined by user as important
    || stringOrNull(content.data.title) || stringOrNull(content.data.heading) || stringOrNull(content.data.header) // Use other typical content titles (overrides displayName)
    || stringOrNull(content.displayName) // Use content's display name
    || stringOrNull(siteConfig.seoTitle) // Use default og-title for site
    || stringOrNull(site.displayName) // Use site default
    || ''

  return metaTitle;
};

exports.getMetaDescription = (content, site) => {
  const siteConfig = exports.getTheConfig(site);

  const userDefinedPaths = siteConfig.pathsDescriptions || '';
  const userDefinedArray = libs.util.data.forceArray(userDefinedPaths);
  const userDefinedValue = userDefinedPaths ? findValueInJson(content, userDefinedArray) : null;

  const setWithMixin = content.x[appNamePath]
    && content.x[appNamePath][mixinPath]
    && content.x[appNamePath][mixinPath].seoDescription;

  let metaDescription = setWithMixin ? content.x[appNamePath][mixinPath].seoDescription // Get from mixin
    : userDefinedValue
    || content.data.preface || content.data.description || content.data.summary // Use typical content summary names
    || siteConfig.seoDescription // Use default for site
    || site.description // Use bottom default
    || ''; // Don't crash plugin on clean installs

  // Strip away all html tags, in case there's any in the description.
  const regex = /(<([^>]+)>)/ig;
  metaDescription = metaDescription.replace(regex, "");

  return metaDescription;
};

exports.getOpenGraphImage = (content, site, defaultImg, defaultImgPrescaled) => {
  const siteConfig = exports.getTheConfig(site);
  log.info("CONTENT");
  log.info(JSON.stringify(content, null, 4));
  const userDefinedPaths = siteConfig.pathsImages || '';
  const userDefinedArray = libs.util.data.forceArray(userDefinedPaths);
  const userDefinedValue = userDefinedPaths ? findValueInJson(content, userDefinedArray) : null;

  const setWithMixin = content.x[appNamePath]
    && content.x[appNamePath][mixinPath]
    && content.x[appNamePath][mixinPath].seoImage;

  let ogImage;

  // Try to find an image in the content's image or images properties
  const imageArray = libs.util.data.forceArray(
    setWithMixin ? stringOrNull(content.x[appNamePath][mixinPath].seoImage)
      : userDefinedValue
      || content.data.image
      || content.data.images
      || []);

  if (content.data.cover.type.video && content.data.cover.type.video.id) {
    const video = libs.content.get({ key: content.data.cover.type.video.id });
    if (video && video.data.image) {
      const image = libs.content.get({ key: video.data.image });
      defaultImg = image._path;
    }
  }

  if (imageArray.length || (defaultImg && !defaultImgPrescaled)) {

    // Set basic image options
    const imageOpts = {
      scale: 'block(1200,630)', // Open Graph requires 600x315 for landscape format. Double that for retina display.
      quality: 85,
      format: 'jpg',
      type: 'absolute'
    };

    // Set the ID to either the first image in the set or use the default image ID
    imageOpts.id = imageArray.length ? (imageArray[0].image || imageArray[0]) : defaultImg;

    if (isString(imageOpts.id)) {
      // Fetch actual image, make sure not to force it into .jpg if it's a SVG-file.
      const theImage = libs.content.get({
        key: imageOpts.id
      });
      let mimeType = null;
      if (theImage) {
        if (theImage.data.media.attachment) {
          mimeType = theImage.attachments[theImage.data.media.attachment].mimeType; // Get the actual mimeType
        } else if (theImage.data.media) {
          mimeType = theImage.attachments[theImage.data.media].mimeType;
        }
      }
      // Reset forced format on SVG to make them servable through portal.imageUrl().
      if (!mimeType || mimeType === 'image/svg+xml') {
        imageOpts.quality = null;
        imageOpts.format = null;
      }

      ogImage = imageOpts.id ? libs.portal.imageUrl(imageOpts) : null;
    }
  } else if (defaultImg && defaultImgPrescaled) {
    // Serve pre-optimized image directly
    ogImage = libs.portal.attachmentUrl({
      id: defaultImg,
      type: 'absolute'
    });
  }

  // Return the image URL or nothing
  return ogImage;
};
