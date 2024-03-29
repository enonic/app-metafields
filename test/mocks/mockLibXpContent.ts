import type {
	Content,
	Site,
	get,
	getSite,
	getSiteConfig
} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {jest} from '@jest/globals';


export function mockLibXpContent({
	contents = {},
	siteContent = {} as Site<MetafieldsSiteConfig>
} :{
	contents?: Record<string, Content<unknown>>
	siteContent?: Site<MetafieldsSiteConfig>
} = {
}) {
	jest.mock(
		'/lib/xp/content',
		() => ({
			// @ts-ignore
			get: jest.fn<typeof get>().mockImplementation((getContentParams) => {
				const {
					key,
					// versionId
				} = getContentParams;
				const content = contents[key];
				if (content) {
					return content;
				}
				console.error(`No content found for key: ${key}`);
				return null;
			}),
			// @ts-ignore
			getSite: jest.fn<typeof getSite>().mockReturnValue(siteContent),
			getSiteConfig: jest.fn<typeof getSiteConfig>().mockReturnValue(forceArray(siteContent.data.siteConfig)[0].config),
			getOutboundDependencies: jest.fn().mockReturnValue([]),
			query: jest.fn().mockReturnValue({
				count: 0,
				hits: [],
				total: 0,
			})
		}),
		{virtual: true}
	);
}
