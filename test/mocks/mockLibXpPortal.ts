import type {
	attachmentUrl,
	getSiteConfig,
	imageUrl,
	pageUrl,
} from '/lib/xp/portal';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig';


import {jest} from '@jest/globals';


export function mocklibXpPortal({
	siteConfig = {},
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
			pageUrl: jest.fn<typeof pageUrl>().mockImplementation((pageUrlParams) => {
				// console.debug('pageUrl mock called with', pageUrlParams);
				const {
				// 	applicationKey,
				// 	branch,
				// 	id,
				// 	language,
				// 	params,
					path,
				// 	parts,
				// 	secure,
					type,
				} = pageUrlParams;
				return `${path}${type}PageUrl`;
			}),
		}),
		{virtual: true}
	);
}
