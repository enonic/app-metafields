import {DEBUG} from '/lib/app-metafields/constants';

export const siteRelativePath = ({
	contentPath,
	sitePath,
}: {
	contentPath: string
	sitePath: string
}): string => {
	const _siteRelativePath = `${contentPath.replace(sitePath, '') || '/'}`;
	DEBUG && log.debug(`siteRelativePath(%s) => %s`, JSON.stringify({contentPath, sitePath}, null, 4), _siteRelativePath);
	return _siteRelativePath;
};
