import type {Content, Site} from '@enonic-types/lib-content';
import type {MetafieldsSiteConfig} from '/lib/types';


export const getLang = ({
	content,
	siteOrNull,
}: {
	content: Content,
	siteOrNull: Site<MetafieldsSiteConfig>|null
}): string => {
	if (content.language || siteOrNull?.language) {
		// Format locale into the ISO format that Open Graph wants.
		return (content.language || siteOrNull?.language).replace('-', '_');
	}
	return 'en_US';
}
