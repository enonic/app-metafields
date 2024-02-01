export const getLang = (content, site) => {
	// Format locale into the ISO format that Open Graph wants.
	let locale = 'en_US';
	if (content.language || site.language) {
		locale = (content.language || site.language).replace('-', '_');
	}
	return locale;
}
