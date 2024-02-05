import type {
	get as GetContentByKey,
	Site
} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig';
import type {MediaImage} from '/guillotine/guillotine.d';


import {
	beforeAll,
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';
import {mocklibXpPortal} from '../../mocks/mockLibXpPortal';
import {mockLibUtil} from '../../mocks/mockLibUtil';
import {mockContent} from '../../mocks/mockContent';
import {mockImage} from '../../mocks/mockImage';


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

describe('getImage', () => {
	beforeAll(() => {
		jest.mock(
			'/lib/xp/content',
			() => ({
				get: jest.fn<typeof GetContentByKey<MediaImage>>().mockImplementation(({key}) => {
					// console.debug('GetContentByKey', key);
					if (key === 'oneImageContentId') {
						return imageContent1;
					}
					if (key === 'twoImageContentId') {
						return imageContent2;
					}
					if (key === 'threeImageContentId') {
						return imageContent3;
					}
					if (key === 'fourImageContentId') {
						return imageContent4;
					}
					return null;
				})
			}),
			{virtual: true}
		);
		mocklibXpPortal({
			siteConfig: metaFieldsSiteConfig
		});
		mockLibUtil();
	});
	it('should return undefined when no image found', () => {
		import('/lib/common/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: mockContent({
					prefix: 'articleWithoutImage'
				}),
				site: siteContent
			})).toBeUndefined();
		}); // import
	}); // it

	it('should return attachmentUrl when defaultImg and defaultImgPrescaled provided', () => {
		import('/lib/common/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: mockContent({
					prefix: 'articleWithoutImage',
				}),
				defaultImg: 'threeImageContentId',
				defaultImgPrescaled: true,
				site: siteContent
			})).toBe('threeImageContentIdabsoluteAttachmentUrl');
		}); // import
	}); // it

	it('should handle svgs', () => {
		import('/lib/common/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: mockContent({
					prefix: 'articleWithImage',
					data: {
						image: 'fourImageContentId',
					}
				}),
				site: siteContent
			})).toBe('fourImageContentIdblock(1200,630)absoluteImageUrl');
		}); // import
	}); // it

	it('should return an url when content has data.image', () => {
		import('/lib/common/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: mockContent({
					prefix: 'articleWithImage',
					data: {
						image: 'oneImageContentId',
						images: 'twoImageContentId'
					}
				}),
				site: siteContent
			})).toBe('oneImageContentIdjpg85block(1200,630)absoluteImageUrl');
		}); // import
	}); // it

	it('should return an url when content has data.images', () => {
		import('/lib/common/getImageUrl').then(({getImageUrl}) => {
			expect(getImageUrl({
				applicationConfig: {},
				applicationKey: 'com.enonic.app.metafields',
				content: mockContent({
					prefix: 'articleWithImages',
					data: {
						images: 'twoImageContentId'
					}
				}),
				site: siteContent
			})).toBe('twoImageContentIdjpg85block(1200,630)absoluteImageUrl');
		}); // import
	}); // it
}); // describe