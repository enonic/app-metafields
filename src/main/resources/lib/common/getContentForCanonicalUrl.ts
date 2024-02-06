import type {Content} from '@enonic-types/lib-content';


import {get as getContentByKey} from '/lib/xp/content';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';


export const getContentForCanonicalUrl = (content: Content): Content =>
	content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoContentForCanonicalUrl
	&& getContentByKey({
		key: content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl as string
	});
