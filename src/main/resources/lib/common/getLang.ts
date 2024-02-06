import type {Content, Site} from '@enonic-types/lib-content';
import type {MetafieldsSiteConfig} from '/lib/types';


export const getLang = (content: Content, site: Site<MetafieldsSiteConfig>) => {
	// Format locale into the ISO format that Open Graph wants.
	let locale = 'en_US';
	if (content.language || site.language) {
		locale = (content.language || site.language).replace('-', '_');
	}
	return locale;
}
