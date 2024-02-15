import {siteRelativePath} from '/lib/app-metafields/path/siteRelativePath';


export const prependBaseUrl = ({
	baseUrl,
	contentPath,
	sitePath,
}: {
	baseUrl: string
	contentPath: string
	sitePath: string
}): string => {
	const prependedBaseUrl = `${baseUrl}${siteRelativePath({
		contentPath,
		sitePath,
	})}`;
	// log.info(`prependBaseUrl(%s) => %s`, JSON.stringify({baseUrl, contentPath, sitePath}, null, 4), prependedBaseUrl);
	return prependedBaseUrl
}
