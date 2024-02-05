import type {
	Content,
	get as GetContentByKey,
	// Site
} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/types';


import {
	// beforeAll,
	beforeEach,
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {mockContent} from '../../mocks/mockContent';
import {mockLibThymeleaf} from '../../mocks/mockLibThymeleaf';
import {mockLibUtil} from '../../mocks/mockLibUtil';
import {mockLibXpContext} from '../../mocks/mockLibXpContext';
import {mocklibXpPortal} from '../../mocks/mockLibXpPortal';
import {mockSite} from '../../mocks/mockSite';


// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
globalThis.log = {
	error: console.error,
	warning: console.warn,
	info: console.info,
	debug: console.debug,
}

// @ts-ignore TS2339: Property 'resolve' does not exist on type 'typeof globalThis'.
globalThis.resolve = (path: string) => {
	// console.debug('resolve path', path);
	const fullPath = join(__dirname, '../../../src/main/resources/lib/metadata', path);
	// console.debug('resolve fullPath', fullPath);
	const data = readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });
	// console.debug('resolve data', data);
	return data;
}

const metaFieldsSiteConfig: MetafieldsSiteConfig = {};


describe('getMetaData', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // Resets the state of all mocks. Equivalent to calling .mockReset() on every mocked function.
		jest.resetModules();
		mockLibXpContext();
		mockLibThymeleaf();
		mockLibUtil();
		jest.mock(
			'/lib/xp/content',
			() => ({
				get: jest.fn<typeof GetContentByKey<Content>>().mockImplementation(({key}) => {
					// console.debug('GetContentByKey', key);
					return null;
				}),
				getOutboundDependencies: jest.fn().mockReturnValue([]),
				query: jest.fn().mockReturnValue({
					count: 0,
					hits: [],
					total: 0,
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
		const siteConfig: MetafieldsSiteConfig = {
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

	it('should handle siteConfig.removeTwitterImage', () => {
		const siteConfig: MetafieldsSiteConfig = {
			...metaFieldsSiteConfig,
			removeTwitterImage: true,
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
				twitterImageUrl: null,
				url: 'oneContentPathabsolutePageUrl',
			});
		}); // import
	}); // it

	it('should html when returnType is html', () => {
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
				returnType: 'html',
				// selfClosingTags: true // Doesn't affect the output in this test
			})).resolves.toEqual(
				'<html><head></head><body><div data-th-remove="tag">\n' +
				'<meta data-th-if="${blockRobots}" name="robots" content="noindex,nofollow">\n' +
				'<link data-th-if="${canonical}" data-th-attr="rel=canonical" data-th-href="${canonicalUrl}">\n' +
				'<meta data-th-if="${siteVerification}" name="google-site-verification" content="" data-th-attr="content=${siteVerification}">\n' +
				'<meta name="description" data-th-attr="content=${description}">\n' +
				'<!--/* Open graph */-->\n' +
				'<meta property="og:title" data-th-attr="content=${title}">\n' +
				'<meta property="og:description" data-th-attr="content=${description}">\n' +
				'<meta property="og:site_name" data-th-attr="content=${siteName}">\n' +
				'<th:block data-th-if="${url}">\n' +
				"<!--/* Don't indent th:block, output gets indented too */-->\n" +
				'<meta property="og:url" data-th-attr="content=${url}">\n' +
				'</th:block>\n' +
				'<meta property="og:type" data-th-attr="content=${type}">\n' +
				'<meta property="og:locale" data-th-attr="content=${locale}">\n' +
				'<th:block data-th-if="${imageUrl}">\n' +
				'<meta property="og:image" data-th-attr="content=${imageUrl}">\n' +
				'<meta property="og:image:width" data-th-attr="content=${imageWidth}">\n' +
				'<meta property="og:image:height" data-th-attr="content=${imageHeight}">\n' +
				'</th:block>\n' +
				'<!--/* Twitter */-->\n' +
				'<th:block data-th-if="${twitterUserName}">\n' +
				'<meta name="twitter:card" content="summary_large_image">\n' +
				'<meta name="twitter:title" data-th-attr="content=${title}">\n' +
				'<meta name="twitter:description" data-th-attr="content=${description}">\n' +
				'<th:block data-th-if="${twitterImageUrl}">\n' +
				'<meta name="twitter:image:src" data-th-attr="content=${twitterImageUrl}">\n' +
				'</th:block>\n' +
				'<meta name="twitter:site" data-th-attr="content=${twitterUserName}">\n' +
				'</th:block>\n' +
				'</div>\n' +
				'</body></html>'
			);
		}); // import
	}); // it

	it('should handle selfClosingTags', () => {
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
				returnType: 'html',
				selfClosingTags: true // Doesn't affect the output in this test
			})).resolves.toEqual(
				'<html><head></head><body><div data-th-remove="tag">\n' +
				'<meta data-th-if="${blockRobots}" name="robots" content="noindex,nofollow">\n' +
				'<link data-th-if="${canonical}" data-th-attr="rel=canonical" data-th-href="${canonicalUrl}">\n' +
				'<meta data-th-if="${siteVerification}" name="google-site-verification" content="" data-th-attr="content=${siteVerification}">\n' +
				'<meta name="description" data-th-attr="content=${description}">\n' +
				'<!--/* Open graph */-->\n' +
				'<meta property="og:title" data-th-attr="content=${title}">\n' +
				'<meta property="og:description" data-th-attr="content=${description}">\n' +
				'<meta property="og:site_name" data-th-attr="content=${siteName}">\n' +
				'<th:block data-th-if="${url}">\n' +
				"<!--/* Don't indent th:block, output gets indented too */-->\n" +
				'<meta property="og:url" data-th-attr="content=${url}">\n' +
				'</th:block>\n' +
				'<meta property="og:type" data-th-attr="content=${type}">\n' +
				'<meta property="og:locale" data-th-attr="content=${locale}">\n' +
				'<th:block data-th-if="${imageUrl}">\n' +
				'<meta property="og:image" data-th-attr="content=${imageUrl}">\n' +
				'<meta property="og:image:width" data-th-attr="content=${imageWidth}">\n' +
				'<meta property="og:image:height" data-th-attr="content=${imageHeight}">\n' +
				'</th:block>\n' +
				'<!--/* Twitter */-->\n' +
				'<th:block data-th-if="${twitterUserName}">\n' +
				'<meta name="twitter:card" content="summary_large_image">\n' +
				'<meta name="twitter:title" data-th-attr="content=${title}">\n' +
				'<meta name="twitter:description" data-th-attr="content=${description}">\n' +
				'<th:block data-th-if="${twitterImageUrl}">\n' +
				'<meta name="twitter:image:src" data-th-attr="content=${twitterImageUrl}">\n' +
				'</th:block>\n' +
				'<meta name="twitter:site" data-th-attr="content=${twitterUserName}">\n' +
				'</th:block>\n' +
				'</div>\n' +
				'</body></html>'
			);
		}); // import
	}); // it
}); // describe
