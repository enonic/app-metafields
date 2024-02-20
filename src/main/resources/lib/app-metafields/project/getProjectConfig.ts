import type {Site} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {toStr} from '@enonic/js-utils/value/toStr';
import {get as getContent} from '/lib/xp/content';
import {DEBUG} from '/lib/app-metafields/constants';
import {getSiteConfigFromSite} from '/lib/app-metafields/xp/getSiteConfigFromSite';


export const getProjectConfig = () => {
	const rootContent = getContent<Site<MetafieldsSiteConfig>>({
		key: '/'
	});
	DEBUG && log.debug('contentMetaFieldsResolver rootContent:%s', toStr(rootContent));
	const projectConfig = getSiteConfigFromSite({
		applicationKey: app.name,
		site: rootContent
	});
	DEBUG && log.debug('contentMetaFieldsResolver projectConfig:%s', toStr(projectConfig));
	return projectConfig || {};
}
