import type {
	attachmentUrl,
	getSiteConfig,
	imageUrl
} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig';

import {jest} from '@jest/globals';


export function mocklibXpPortal({
	siteConfig = {
		blockRobots: true,
		canonical: true,
		disableAppConfig: true,
		frontpageImage: 'frontpageImage',
		frontpageImageIsPrescaled: true,
		fullPath: true,
		headless: true,
		pathsDescriptions: 'pathsDescriptions', // with comma
		pathsImages: 'pathsImages', // with comma
		pathsTitles: 'pathsTitles', // with comma
		seoDescription: 'seoDescription',
		seoImage: 'seoImage',
		seoImageIsPrescaled: true,
		seoTitle: 'seoTitle',
		siteVerification: 'siteVerification',
		removeOpenGraphImage: true,
		removeOpenGraphUrl: true,
		removeTwitterImage: true,
		titleBehaviour: true,
		titleFrontpageBehaviour: true,
		titleSeparator: '-',
		twitterUsername: '@twitterUsername',
	}
}: {
	siteConfig?: MetafieldsSiteConfig
} = {}) {
	jest.mock(
		'/lib/xp/portal',
		() => ({
			attachmentUrl: jest.fn<typeof attachmentUrl>().mockImplementation((attachmentUrlParams) => {
				// console.debug('attachmentUrl mock called with', attachmentUrlParams);
				const {
				// 	download,
					id,
				// 	label,
				// 	name,
				// 	params,
				// 	path,
					type,
				} = attachmentUrlParams;
				return `${id}${type}AttachmentUrl`;
			}),
			getSiteConfig: jest.fn<typeof getSiteConfig<MetafieldsSiteConfig>>().mockReturnValue(siteConfig),
			imageUrl: jest.fn<typeof imageUrl>().mockImplementation((imageUrlParams) => {
				// console.debug('imageUrl mock called with', imageUrlParams);
				const {
				// 	background,
				// 	filter,
					format,
					id,
				// 	params,
				// 	path,
					quality,
					scale,
				// 	server,
					type,
				} = imageUrlParams;
				return `${id}${format || ''}${quality || ''}${scale}${type}ImageUrl`;
			}),
		}),
		{virtual: true}
	);
}
