import {getAppendix} from '/lib/common/getAppendix';
import {getPageTitle} from '/lib/common/getPageTitle';


export function getTitle(site, content=undefined) {
	if (!content) {
		return undefined;
	}

	const isFrontpage = site._path === content._path;
	const titleAppendix = getAppendix(site, isFrontpage);
	const pageTitle = getPageTitle(content, site);
	const titleHtml = "<title>" + pageTitle + titleAppendix + "</title>";

	return titleHtml;
}
