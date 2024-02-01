import {commaStringToArray} from '/lib/common/commaStringToArray';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {getTheConfig} from '/lib/common/getTheConfig';


export const getMetaDescription = (content, site) => {
	var siteConfig = getTheConfig(site);

	var userDefinedPaths = siteConfig.pathsDescriptions || '';
	var userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
	var userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;

	var setWithMixin = content.x[APP_NAME_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH]
		&& content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription;

	var metaDescription = setWithMixin ? content.x[APP_NAME_PATH][MIXIN_PATH].seoDescription // Get from mixin
		: userDefinedValue
		|| content.data.preface || content.data.description || content.data.summary // Use typical content summary names
		|| siteConfig.seoDescription // Use default for site
		|| site.description // Use bottom default
		|| ''; // Don't crash plugin on clean installs

	// Strip away all html tags, in case there's any in the description.
	var regex = /(<([^>]+)>)/ig;
	metaDescription = metaDescription.replace(regex, "");

	return metaDescription;
};
