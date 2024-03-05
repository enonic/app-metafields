import type {
	Content,
	get as GetContentByKey,
	// Site
} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types';


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
import {mockContent} from '../../../mocks/mockContent';
import {mockLibThymeleaf} from '../../../mocks/mockLibThymeleaf';
import {mockLibXpContent} from '../../../mocks/mockLibXpContent';
import {mockLibXpContext} from '../../../mocks/mockLibXpContext';
import {mockLibXpNode} from '../../../mocks/mockLibXpNode';
import {mocklibXpPortal} from '../../../mocks/mockLibXpPortal';
import {mockImage} from '../../../mocks/mockImage';
import {mockSite} from '../../../mocks/mockSite';


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
	const fullPath = join(__dirname, '../../../../src/main/resources/lib/app-metafields/processor', path);
	// console.debug('resolve fullPath', fullPath);
	const data = readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });
	// console.debug('resolve data', data);
	return data;
}

const metaFieldsSiteConfig: MetafieldsSiteConfig = {
	pathsImages: 'pathsImages0,pathsImages1'
};

const imageContent1 = mockImage({
	name: 'image1.jpg',
	prefix: 'one'
});

describe('getMetaData', () => {
	beforeEach(() => {
		jest.resetAllMocks(); // Resets the state of all mocks. Equivalent to calling .mockReset() on every mocked function.
		jest.resetModules();
		mockLibXpContext();
		mockLibThymeleaf();
	});

	it('should return undefined when content is undefined', () => {
		mockLibXpNode();
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		const site = mockSite({
			description: 'Site description',
			prefix: 'site',
			siteConfig: metaFieldsSiteConfig
		});
		mockLibXpContent({
			contents: {
				'/': {} as Content<unknown>,
				oneImageContentId: imageContent1,
			},
			siteContent: site
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			expect(getMetaData({
				mergedConfig: metaFieldsSiteConfig,
				site,
			})).toBeUndefined();
		}); // import
	}); // it

	it('should return an object when content is defined', () => {
		mockLibXpNode({
			nodes: {
				oneContentId: {},
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		const site = mockSite({
			description: 'Site description',
			prefix: 'site',
			siteConfig: metaFieldsSiteConfig
		});
		mockLibXpContent({
			contents: {
				'/': {} as Content<unknown>,
				oneImageContentId: imageContent1,
			},
			siteContent: site
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			expect(getMetaData({
				mergedConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'one',
					type: 'base:folder',
				}),
				site,
			})).toEqual({
				blockRobots: false,
				canonicalUrl: null,
				description: 'Site description',
				imageUrl: null,
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				openGraph: {
					article: {
						expirationTime: undefined,
						modifiedTime: undefined,
						publishedTime: undefined
					}
				},
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

	it('should handle frontpage', () => {
		mockLibXpNode({
			nodes: {
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig: metaFieldsSiteConfig
			});
			mockLibXpContent({
				contents: {
					'/': {} as Content<unknown>,
					oneImageContentId: imageContent1,
				},
				siteContent: site
			});
			expect(getMetaData({
				mergedConfig: metaFieldsSiteConfig,
				content: site,
				site,
			})).toEqual({
				blockRobots: false,
				canonicalUrl: null,
				description: 'Site description',
				imageUrl: null,
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				openGraph: {
					article: null
				},
				siteName: 'siteContentDisplayName',
				siteVerification: null,
				title: 'siteContentDisplayName',
				type: 'website',
				twitterUserName: undefined,
				twitterImageUrl: null,
				url: 'siteContentPathabsolutePageUrl',
			});
		}); // import
	}); // it

	it('should make imageUrl', () => {
		mockLibXpNode({
			nodes: {
				oneContentId: {},
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			const contentWithImage = mockContent({
				prefix: 'one',
				data: {
					pathsImages0: 'oneImageContentId',
				},
				type: 'base:folder',
			});
			const siteConfig = metaFieldsSiteConfig;
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig
			});
			mockLibXpContent({
				contents: {
					'/': {} as Content<unknown>,
					oneImageContentId: imageContent1,
				},
				siteContent: site
			});
			expect(getMetaData({
				mergedConfig: siteConfig,
				content: contentWithImage,
				site,
			})).toEqual({
				blockRobots: false,
				canonicalUrl: null,
				description: 'Site description',
				imageUrl: 'oneImageContentIdblock(1200,630)absoluteImageUrl',
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				openGraph: {
					article: {
						expirationTime: undefined,
						modifiedTime: undefined,
						publishedTime: undefined
					}
				},
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
		mockLibXpNode({
			nodes: {
				oneContentId: {},
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			const contentWithImage = mockContent({
				prefix: 'one',
				data: {
					pathsImages0: 'oneImageContentId'
				},
				type: 'base:folder',
			});
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig
			});
			mockLibXpContent({
				contents: {
					'/': {} as Content<unknown>,
					oneImageContentId: imageContent1,
				},
				siteContent: site
			});
			expect(getMetaData({
				mergedConfig: siteConfig,
				content: contentWithImage,
				site,
			})).toEqual({
				blockRobots: false,
				canonicalUrl: null,
				description: 'Site description',
				imageUrl: null, // The test is that this is null
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				openGraph: {
					article: {
						expirationTime: undefined,
						modifiedTime: undefined,
						publishedTime: undefined
					}
				},
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
		mockLibXpNode({
			nodes: {
				oneContentId: {},
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			const contentWithImage = mockContent({
				prefix: 'one',
				data: {
					pathsImages0: 'oneImageContentId'
				},
				type: 'base:folder',
			});
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig
			});
			mockLibXpContent({
				contents: {
					'/': {} as Content<unknown>,
					oneImageContentId: imageContent1,
				},
				siteContent: site
			});
			expect(getMetaData({
				mergedConfig: siteConfig,
				content: contentWithImage,
				site,
			})).toEqual({
				blockRobots: false,
				canonicalUrl: null,
				description: 'Site description',
				imageUrl: 'oneImageContentIdblock(1200,630)absoluteImageUrl',
				imageWidth: 1200,
				imageHeight: 630,
				locale: 'en_US',
				openGraph: {
					article: {
						expirationTime: undefined,
						modifiedTime: undefined,
						publishedTime: undefined
					}
				},
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
		mockLibXpNode({
			nodes: {
				oneContentId: {},
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig: metaFieldsSiteConfig
			});
			mockLibXpContent({
				contents: {
					'/': {} as Content<unknown>,
					oneImageContentId: imageContent1,
				},
				siteContent: site
			});
			expect(getMetaData({
				mergedConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'one',
					type: 'base:folder',
				}),
				site,
				returnType: 'html',
				// selfClosingTags: true // Doesn't affect the output in this test
			})).resolves.toEqual(
				'<html><head></head><body><div data-th-remove="tag">\n' +
				'<meta data-th-if="${blockRobots}" name="robots" content="noindex,nofollow">\n' +
				'<link th:if="${canonicalUrl}" th:attr="rel=canonical" th:href="${canonicalUrl}">\n' +
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
				'<th:block data-th-if="${openGraph.article}">\n' +
				'<meta property="article:expiration_time" data-th-attr="content=${openGraph.article.expirationTime}" data-th-if="${openGraph.article.expirationTime}">\n' +
				'<meta property="article:modified_time" data-th-attr="content=${openGraph.article.modifiedTime}" data-th-if="${openGraph.article.modifiedTime}">\n' +
				'<meta property="article:published_time" data-th-attr="content=${openGraph.article.publishedTime}" data-th-if="${openGraph.article.publishedTime}">\n' +
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
		mockLibXpNode({
			nodes: {
				oneContentId: {},
				siteContentId: {}
			}
		});
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		import('/lib/app-metafields/processor/getMetaData').then(({getMetaData}) => {
			const site = mockSite({
				description: 'Site description',
				prefix: 'site',
				siteConfig: metaFieldsSiteConfig
			});
			mockLibXpContent({
				contents: {
					'/': {} as Content<unknown>,
					oneImageContentId: imageContent1,
				},
				siteContent: site
			});
			expect(getMetaData({
				mergedConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'one',
					type: 'base:folder',
				}),
				site,
				returnType: 'html',
				selfClosingTags: true // Doesn't affect the output in this test
			})).resolves.toEqual(
				'<html><head></head><body><div data-th-remove="tag">\n' +
				'<meta data-th-if="${blockRobots}" name="robots" content="noindex,nofollow">\n' +
				'<link th:if="${canonicalUrl}" th:attr="rel=canonical" th:href="${canonicalUrl}">\n' +
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
				'<th:block data-th-if="${openGraph.article}">\n' +
				'<meta property="article:expiration_time" data-th-attr="content=${openGraph.article.expirationTime}" data-th-if="${openGraph.article.expirationTime}">\n' +
				'<meta property="article:modified_time" data-th-attr="content=${openGraph.article.modifiedTime}" data-th-if="${openGraph.article.modifiedTime}">\n' +
				'<meta property="article:published_time" data-th-attr="content=${openGraph.article.publishedTime}" data-th-if="${openGraph.article.publishedTime}">\n' +
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
