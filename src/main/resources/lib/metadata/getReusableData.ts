import {
	get as getContentByKey,
	getSite as libsContentGetSite,
	getSiteConfig as libsContentGetSiteConfig,
} from '/lib/xp/content';
import {
	getContent as getCurrentContent,
	getSite as libPortalGetSite,
	getSiteConfig as libPortalGetSiteConfig,
} from '/lib/xp/portal';


export function getReusableData({
	applicationKey, // Avoid app.name so it can be used in Guillotine Extension Context
	contentPath = undefined
}: {
	applicationKey: string
	contentPath?: string
}) {
	let site, content, siteConfig;

	if (!contentPath) {
		site = libPortalGetSite();
		content = getCurrentContent();
		siteConfig = libPortalGetSiteConfig();
	} else {
		content = getContentByKey({ key: contentPath });
		site = libsContentGetSite({ key: contentPath });
		siteConfig = libsContentGetSiteConfig({
			applicationKey,
			key: contentPath
		});
	}

	return { site, content, siteConfig };
}
