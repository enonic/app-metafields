import {get as getContentByKey} from '/lib/xp/content';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';


export const getContentForCanonicalUrl = (content) => content.x[APP_NAME_PATH]
	&& content.x[APP_NAME_PATH][MIXIN_PATH]
	&& content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl
	&& getContentByKey({
		key: content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl
	});
