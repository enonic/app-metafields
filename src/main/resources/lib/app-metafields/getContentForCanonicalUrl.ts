import type {Content} from '@enonic-types/lib-content';


import {get as getContentByKey} from '/lib/xp/content';
import {get as getContext} from '/lib/xp/context';
import {connect} from '/lib/xp/node';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/app-metafields/constants';


export const getContentForCanonicalUrl = (content: Content): Content|null => {

	// If a specific canonical content is selected
	if (content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoContentForCanonicalUrl) {
		const canonicalContent = getContentByKey({
			key: content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl as string
		});
		return canonicalContent;
	}

	// If the content is a variant of another content (recursively)
	const {branch, repository: repoId} = getContext();
	const connection = connect({
		branch,
		repoId
	});
	const node = connection.get<{variantOf?:string}>(content._id);
	const {variantOf} = node;
	if (variantOf) {
		const canonicalContent = getContentByKey({
			key: variantOf
		});
		const parentCanonicalContent = getContentForCanonicalUrl(canonicalContent); // recurse
		if (parentCanonicalContent) {
			return parentCanonicalContent;
		}
		return canonicalContent;
	}

	// If the content has no canonical content
	return null;
}
