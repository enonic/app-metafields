import type {
	BaseFolderContent,
	CreateDataFetcherResultParams,
	GraphQL,
	GraphQLBoolean,
	GraphQLDate,
	GraphQLDateTime,
	GraphQLFloat,
	GraphQLID,
	GraphQLInt,
	GraphQLJson,
	GraphQLLocalDateTime,
	GraphQLLocalTime,
	GraphQLString,
} from '@enonic-types/guillotine';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';
import type {
	getSite as ContentGetSite,
	Site
} from '/lib/xp/content';
import type {getSiteConfig} from '/lib/xp/portal';
import type {MetafieldsResult} from '/guillotine/guillotine.d';


import {
	// beforeAll,
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';
import {mockImage} from '../mocks/mockImage';
import {mockLibXpContent} from '../mocks/mockLibXpContent';
import {mockLibXpContext} from '../mocks/mockLibXpContext';
import {mockLibXpNode} from '../mocks/mockLibXpNode';

// @ts-ignore TS2339: Property 'log' does not exist on type 'typeof globalThis'.
globalThis.log = {
	error: console.error,
	warning: console.warn,
	info: console.info,
	debug: console.debug,
}

// @ts-ignore TS2339: Property '__' does not exist on type 'typeof globalThis'.
globalThis.__ = {
	toScriptValue: (value) => value
}

const metaFieldsSiteConfig: MetafieldsSiteConfig = {
	baseUrl: 'https://www.example.com',
	blockRobots: true,
	canonical: true,
	fullPath: true,
	pathsDescriptions: 'pathsDescriptions', // with comma
	pathsImages: 'pathsImages', // with comma
	pathsTitles: 'pathsTitles', // with comma
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
	_path: '/siteContentPath',
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

const folderContent: BaseFolderContent = {
	_id: 'folderContentId',
	_name: 'folderContentName',
	_path: '/folderContentPath',
	attachments: {},
	creator: 'user:system:creator',
	createdTime: '2021-01-01T00:00:00Z',
	data: {},
	displayName: 'folderContentDisplayName',
	owner: 'user:system:owner',
	type: 'base:folder',
	hasChildren: false,
	valid: true,
	x: {},
}

const imageContent = mockImage({
	name: 'image.jpg',
	prefix: 'image'
});

mockLibXpContent({
	siteContent
});
mockLibXpContext();
mockLibXpNode({
	nodes: {
		folderContentId: {}
	}
});

jest.mock(
	'/lib/xp/portal',
	() => ({
		getSiteConfig: jest.fn<typeof getSiteConfig<MetafieldsSiteConfig>>().mockReturnValue(metaFieldsSiteConfig)
	}),
	{virtual: true}
);

const metafieldsResult: MetafieldsResult = {
	baseUrl: 'https://www.example.com',
	canonical: null,
	description: 'seoDescription',
	// image: imageContent,
	fullTitle: 'folderContentDisplayName - siteContentDisplayName',
	locale: 'en_US',
	openGraph: {
		hideImages: true,
		hideUrl: true,
		type: 'article'
	},
	robots: {
		follow: false,
		index: false
	},
	siteName: 'siteContentDisplayName',
	title: 'folderContentDisplayName',
	twitter: {
		hideImages: true,
		site: '@twitterUsername',
	},
	verification: {
		google: 'siteVerification'
	},
};

const graphQLContent = siteContent as Site<MetafieldsSiteConfig>;

const graphQL: Partial<GraphQL> = {
	GraphQLBoolean: true as GraphQLBoolean,
	GraphQLInt: 1 as GraphQLInt,
	GraphQLString: 'string' as GraphQLString,
	GraphQLID: 'id' as GraphQLID,
	GraphQLFloat: 1.1 as GraphQLFloat,
	Json: '{"json": "value"}' as GraphQLJson,
	DateTime: '2021-01-01T00:00:00Z' as GraphQLDateTime,
	Date: '2021-01-01' as GraphQLDate,
	LocalTime: '00:00:00' as GraphQLLocalTime,
	LocalDateTime: '2021-01-01T00:00:00' as GraphQLLocalDateTime,
	createDataFetcherResult: ({data, localContext, parentLocalContext}) => ({
		source: data as any,
		localContext: {...parentLocalContext, ...localContext}
	}),
	nonNull: (type) => type,
	list: (type) => [type],
	reference: (typeName) => {
		// console.debug('reference typeName', typeName);
		if (typeName === 'media_Image') {
			return imageContent;
		}
		if (typeName === 'MetaFields') {
			return metafieldsResult;
		}
		return graphQLContent;
	},
};

describe('guillotine extensions', () => {
	// beforeAll(() => {
	// 	jest.mock(
	// 		'/lib/xp/content',
	// 		() => ({
	// 			getSite: jest.fn<typeof ContentGetSite>().mockReturnValue(siteContent),
	// 			getOutboundDependencies: jest.fn().mockReturnValue([]),
	// 			query: jest.fn().mockReturnValue({
	// 				count: 0,
	// 				hits: [],
	// 				total: 0,
	// 			})
	// 		}),
	// 		{virtual: true}
	// 	);
	// });

	it("does it's thing", () => {
		import('/guillotine/guillotine').then(({extensions}) => {
			// @ts-expect-error Project types doesn't match @enonic-types/guillotine
			const res = extensions(graphQL);
			expect(JSON.parse(JSON.stringify(res))).toEqual({
				creationCallbacks: {
					// "Content": Content
				},
				resolvers: {
					Content: {
						// metaFields: contentMetaFieldsResolver
					},
					MetaFields: {
						// image: metaFieldsImagesResolver
					}
				},
				types: {
					MetaFields: {
						description: "Meta fields for a content",
						fields: {
							baseUrl: {type: 'string'},
							canonical: {type: 'string'},
							description: {type: 'string'},
							fullTitle: {type: 'string'},
							image: {
								type: imageContent
							},
							locale: {type: 'string'},
							openGraph: {type: '{"json": "value"}'},
							robots: {type: '{"json": "value"}'},
							siteName: {type: 'string'},
							title: {type: 'string'},
							twitter: {type: '{"json": "value"}'},
							verification: {type: '{"json": "value"}'},
						}
					} // MetaFields
				} // types
			}); // expect
			const {
				creationCallbacks: {
					Content: contentFunction
				},
				resolvers: {
					Content: {
						metaFields: contentMetaFieldsResolver
					},
					MetaFields: {
						image: metaFieldsImagesResolver
					}
				}
			} = res;
			const params = {
				addFields: () => null
			}
			// @ts-expect-error Project types doesn't match @enonic-types/guillotine
			expect(contentFunction(params)).toBeUndefined();
			expect(contentMetaFieldsResolver({
				args: {},
				localContext: {
					branch: 'master',
					project: 'project'
				},
				source: folderContent
			})).toEqual({
				localContext: {
					branch: 'master',
					contentJson: JSON.stringify(folderContent),
					mergedConfigJson: JSON.stringify(metaFieldsSiteConfig),
					project: 'project',
					siteJson: JSON.stringify(siteContent),
				},
				source: metafieldsResult,
			});
			// expect(metaFieldsImagesResolver({}));
		}); // import
	}); // it
}); // describe
