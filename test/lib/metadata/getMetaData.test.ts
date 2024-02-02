import type {
	Content,
	get as GetContentByKey,
	// Site
} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig';


import {
	// beforeAll,
	beforeEach,
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';
import {mockContent} from '../../mocks/mockContent';
import {mockLibThymeleaf} from '../../mocks/mockLibThymeleaf';
import {mockLibUtil} from '../../mocks/mockLibUtil';
import {mocklibXpPortal} from '../../mocks/mockLibXpPortal';
import {mockSite} from '../../mocks/mockSite';


// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
globalThis.log = {
	error: console.error,
	warning: console.warn,
	info: console.info,
	debug: console.debug,
}


const metaFieldsSiteConfig: MetafieldsSiteConfig = {};


describe('getMetaData', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // Resets the state of all mocks. Equivalent to calling .mockReset() on every mocked function.
		jest.resetModules();
		mockLibThymeleaf();
		mockLibUtil();
		jest.mock(
			'/lib/xp/content',
			() => ({
				get: jest.fn<typeof GetContentByKey<Content>>().mockImplementation(({key}) => {
					// console.debug('GetContentByKey', key);
					return null;
				})
			}),
			{virtual: true}
		);
	});

	it('should return undefined when content is undefined', () => {
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/metadata/getMetaData').then(({getMetaData}) => {
			expect(getMetaData({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				site: mockSite({
					description: 'Site description',
					prefix: 'site',
					siteConfig: metaFieldsSiteConfig
				}),
				siteConfig: metaFieldsSiteConfig,
			})).toBeUndefined();
		}); // import
	}); // it

	it('should return an object when content is defined', () => {
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/metadata/getMetaData').then(({getMetaData}) => {
			expect(getMetaData({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: mockContent({
					prefix: 'one'
				}),
				site: mockSite({
					description: 'Site description',
					prefix: 'site',
					siteConfig: metaFieldsSiteConfig
				}),
				siteConfig: metaFieldsSiteConfig,
				// returnType="json",
				// selfClosingTags=false
			})).toEqual({
				blockRobots: undefined,
				canonical: undefined,
				canonicalUrl: 'oneContentPathabsolutePageUrl',
				description: 'Site description',
				imageUrl: undefined,
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				siteName: 'siteContentDisplayName',
				siteVerification: null,
				title: 'oneContentDisplayName',
				type: 'article',
				twitterUserName: undefined,
				twitterImageUrl: undefined,
				url: 'oneContentPathabsolutePageUrl',
			});
		}); // import
	}); // it

	it('should handle frontpage', () => {
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/metadata/getMetaData').then(({getMetaData}) => {
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig: metaFieldsSiteConfig
			});
			expect(getMetaData({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: site,
				site,
				siteConfig: metaFieldsSiteConfig,
				// returnType="json",
				// selfClosingTags=false
			})).toEqual({
				blockRobots: undefined,
				canonical: undefined,
				canonicalUrl: 'siteContentPathabsolutePageUrl',
				description: 'Site description',
				imageUrl: undefined,
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				siteName: 'siteContentDisplayName',
				siteVerification: null,
				title: 'siteContentDisplayName',
				type: 'website',
				twitterUserName: undefined,
				twitterImageUrl: undefined,
				url: 'siteContentPathabsolutePageUrl',
			});
		}); // import
	}); // it

	it('should make imageUrl', () => {
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/metadata/getMetaData').then(({getMetaData}) => {
			const contentWithImage = mockContent({
				prefix: 'one',
				data: {
					image: 'oneImageContentId'
				}
			});
			const siteConfig = metaFieldsSiteConfig;
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig
			});
			expect(getMetaData({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: contentWithImage,
				site,
				siteConfig,
				// returnType="json",
				// selfClosingTags=false
			})).toEqual({
				blockRobots: undefined,
				canonical: undefined,
				canonicalUrl: 'oneContentPathabsolutePageUrl',
				description: 'Site description',
				imageUrl: 'oneImageContentIdblock(1200,630)absoluteImageUrl',
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				siteName: 'siteContentDisplayName',
				siteVerification: null,
				title: 'oneContentDisplayName',
				type: 'article',
				twitterUserName: undefined,
				twitterImageUrl: 'oneImageContentIdblock(1200,630)absoluteImageUrl',
				url: 'oneContentPathabsolutePageUrl',
			});
		}); // import
	}); // it

	it('should handle siteConfig.removeOpenGraphImage', () => {
		const siteConfig = {
			...metaFieldsSiteConfig,
			removeOpenGraphImage: true,
		};
		mocklibXpPortal({
			siteConfig
		});
		import('/lib/metadata/getMetaData').then(({getMetaData}) => {
			const contentWithImage = mockContent({
				prefix: 'one',
				data: {
					image: 'oneImageContentId'
				}
			});
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig
			});
			expect(getMetaData({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: contentWithImage,
				site,
				siteConfig,
				// returnType="json",
				// selfClosingTags=false
			})).toEqual({
				blockRobots: undefined,
				canonical: undefined,
				canonicalUrl: 'oneContentPathabsolutePageUrl',
				description: 'Site description',
				imageUrl: null,
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				siteName: 'siteContentDisplayName',
				siteVerification: null,
				title: 'oneContentDisplayName',
				type: 'article',
				twitterUserName: undefined,
				twitterImageUrl: 'oneImageContentIdblock(1200,630)absoluteImageUrl',
				url: 'oneContentPathabsolutePageUrl',
			});
		}); // import
	}); // it
}); // describe
