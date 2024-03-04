import type {Content, Site} from '@enonic-types/lib-content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types';


export const getLang = ({
	content,
	site,
}: {
	content: Content,
	site: Site<MetafieldsSiteConfig>
}): string => {
	if (content.language || site.language) {
		// Format locale into the ISO format that Open Graph wants.
		return (content.language || site.language).replace('-', '_');
	}
	return 'en_US';
}
