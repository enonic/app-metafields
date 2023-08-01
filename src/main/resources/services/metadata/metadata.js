
const libs = {
    content: require("/lib/xp/content"),
    metadata: require("/lib/metadata")
};

const ERRORS = {
    content_path: "Missing contentPath in query parameters.",
    site_not_found: "Site not found. Please check context of service call, provided contentPath and consider publishing your site.",
    not_in_headless_mode: "App is not configured to run in headless mode. Please check your app config."
}

exports.get = function(req) {  
    const params = req.params;
    const status400 = { status: 400 };

    if (!params.contentPath) {
        log.info(ERRORS.content_path);
        return status400;
    }

    const siteConfig = libs.content.getSiteConfig({ 
        key: params.contentPath, 
        applicationKey: app.name 
    });

    if (!siteConfig) {
        log.info(ERRORS.site_not_found);
        return status400;
    }

    if (!siteConfig.headless) {
        log.info(ERRORS.not_in_headless_mode);
        return status400;
    }

    const body = getData(params.contentPath, params.htmlTag);

    return { body, contentType: 'application/json' }; 
};

function getData(contentPath, htmlTag="<html>") {
    const reusableData = libs.metadata.getReusableData(contentPath);
    const site = reusableData.site;
    const content = reusableData.content;
    const siteConfig = reusableData.siteConfig;

    return {
        metadata: libs.metadata.getMetaData(site, siteConfig, content, "json"),
        htmlTagAttributes: getHtmlTagAttributes(libs.metadata.getFixedHtmlAttrsAsString(htmlTag))
    };
}

function getHtmlTagAttributes(attrString) {
    function clean(str) {
      return str.replaceAll('"', "").trim();
    }

    let arr = [];
    let attrsObj = {};

    const splittedString = attrString.split("=");

    for (let i = 0; i < splittedString.length; i += 1) {
        if (i % 2 === 0) {
            arr.push(splittedString[i]); // attribute
        } else {
            const regex = new RegExp(splittedString[i].indexOf('"') >= 0 ? '" ' : " ");
            arr = arr.concat(splittedString[i].split(regex)); // attribute + value
        }
    }

    if (arr.length % 2 !== 0) {
        return {}
    }

    for (let i = 0; i < arr.length; i += 2) {
        const key = clean(arr[i]);
        const value = clean(arr[i+1]);
        attrsObj[key] = value;
    }

    return attrsObj;
}
