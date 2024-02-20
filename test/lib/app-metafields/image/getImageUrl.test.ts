import type {
	Content,
	Site
} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types';


import {
	beforeAll,
	describe,
	expect,
	// jest,
	test as it,
} from '@jest/globals';
import {mockLibXpContent} from '../../../mocks/mockLibXpContent';
import {mockLibXpContext} from '../../../mocks/mockLibXpContext';
import {mocklibXpPortal} from '../../../mocks/mockLibXpPortal';
import {mockContent} from '../../../mocks/mockContent';
import {mockImage} from '../../../mocks/mockImage';

// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
globalThis.log = {
	error: console.error,
	warning: console.warn,
	info: console.info,
	debug: console.debug,
}


const metaFieldsSiteConfig: MetafieldsSiteConfig = {
	blockRobots: true,
	canonical: true,
	// fullPath: true,
	pathsDescriptions: 'pathsDescriptions0,pathsDescriptions1', // with comma
	pathsImages: 'pathsImages0,pathsImages1', // with comma
	pathsTitles: 'pathsTitles0,pathsTitles1', // with comma
	seoDescription: 'seoDescription',
	seoImage: 'seoImage',
	seoImageIsPrescaled: true,
	siteVerification: 'siteVerification',
	removeOpenGraphImage: true,
	removeOpenGraphUrl: true,
	removeTwitterImage: true,
	titleBehaviour: true,
	titleFrontpageBehaviour: true,
	titleSeparator: '-',
	twitterUsername: '@twitterUsername',
}

const siteContent: Site<MetafieldsSiteConfig> = {
	_id: 'siteContentId',
	_name: 'siteContentName',
	_path: 'siteContentPath',
	attachments: {},
	creator: 'user:system:creator',
	createdTime: '2021-01-01T00:00:00Z',
	data: {
		description: 'Site description',
		siteConfig: {
			applicationKey: app.name,
			config: metaFieldsSiteConfig
		}
	},
	displayName: 'siteContentDisplayName',
	owner: 'user:system:owner',
	type: 'portal:site',
	hasChildren: true,
	valid: true,
	x: {},
}



const imageContent1 = mockImage({
	name: 'image1.jpg',
	prefix: 'one'
});

const imageContent2 = mockImage({
	name: 'image2.jpg',
	prefix: 'two'
});

const imageContent3 = mockImage({
	name: 'image3.jpg',
	prefix: 'three'
});

const imageContent4 = mockImage({
	name: 'image3.svg',
	mimeType: 'image/svg+xml',
	prefix: 'four'
});

describe('getImageUrl', () => {
	beforeAll(() => {
		mockLibXpContent({
			contents: {
				'/': {} as Content<unknown>,
				oneImageContentId: imageContent1,
				twoImageContentId: imageContent2,
				threeImageContentId: imageContent3,
				fourImageContentId: imageContent4,
			},
		});
		mockLibXpContext();
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
	}); // beforeAll

	it('should return undefined when no image found', () => {
		import('/lib/app-metafields/image/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				siteOrProjectOrAppConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'articleWithoutImage',
					type: 'base:folder',
				}),
				siteOrNull: siteContent
			})).toBeUndefined();
		}); // import
	}); // it

	it('should return attachmentUrl when defaultImg and defaultImgPrescaled provided', () => {
		import('/lib/app-metafields/image/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				siteOrProjectOrAppConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'articleWithoutImage',
					type: 'base:folder',
				}),
				defaultImg: 'threeImageContentId',
				defaultImgPrescaled: true,
				siteOrNull: siteContent
			})).toBe('threeImageContentIdabsoluteAttachmentUrl');
		}); // import
	}); // it

	it('should handle svgs', () => {
		const content = mockContent({
			prefix: 'articleWithImage',
			data: {
				pathsImages1: 'fourImageContentId',
			},
			type: 'base:folder',
		});
		// console.info('content', content);
		const getImageUrlParams = {
			siteOrProjectOrAppConfig: metaFieldsSiteConfig,
			content,
			siteOrNull: siteContent
		};
		import('/lib/app-metafields/image/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl(getImageUrlParams)).toBe('fourImageContentIdblock(1200,630)absoluteImageUrl');
		}); // import
	}); // it

	it('should return an url when content has data.pathsImages0', () => {
		import('/lib/app-metafields/image/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				siteOrProjectOrAppConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'articleWithImage',
					data: {
						pathsImages0: 'oneImageContentId',
						pathsImages1: 'twoImageContentId'
					},
					type: 'base:folder',
				}),
				siteOrNull: siteContent
			})).toBe('oneImageContentIdjpg85block(1200,630)absoluteImageUrl');
		}); // import
	}); // it

	it('should return an url when content has data.pathsImages1', () => {
		import('/lib/app-metafields/image/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				siteOrProjectOrAppConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'articleWithImages',
					data: {
						pathsImages1: 'twoImageContentId'
					},
					type: 'base:folder',
				}),
				siteOrNull: siteContent
			})).toBe('twoImageContentIdjpg85block(1200,630)absoluteImageUrl');
		}); // import
	}); // it

	it('should return an url when content has data.pathsImages0[0]', () => {
		import('/lib/app-metafields/image/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				siteOrProjectOrAppConfig: metaFieldsSiteConfig,
				content: mockContent({
					prefix: 'articleWithImages',
					data: {
						pathsImages0: ['twoImageContentId']
					},
					type: 'base:folder',
				}),
				siteOrNull: siteContent
			})).toBe('twoImageContentIdjpg85block(1200,630)absoluteImageUrl');
		}); // import
	}); // it
}); // describe
