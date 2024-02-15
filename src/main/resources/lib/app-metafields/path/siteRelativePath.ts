export const siteRelativePath = ({
	contentPath,
	sitePath,
}: {
	contentPath: string
	sitePath: string
}): string => {
	const _siteRelativePath = `${contentPath.replace(sitePath, '') || '/'}`;
	// log.info(`siteRelativePath(%s) => %s`, JSON.stringify({contentPath, sitePath}, null, 4), _siteRelativePath);
	return _siteRelativePath;
};
