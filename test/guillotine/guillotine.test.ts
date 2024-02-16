import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';
import type {
	getSite as ContentGetSite,
	Site
} from '/lib/xp/content';
import type {
	getSiteConfig
} from '/lib/xp/portal';
import type {
	GraphQL,
	MetaFields,
} from '/lib/types/guillotine';
import type {
	BaseFolder,
} from '/lib/types'


import {
	beforeAll,
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';
import {
	GraphQLBooleanBuilder,
	GraphQLContentBuilder,
	GraphQLDateBuilder,
	GraphQLDateTimeBuilder,
	GraphQLFloatBuilder,
	GraphQLIDBuilder,
	GraphQLIntBuilder,
	GraphQLJsonBuilder,
	GraphQLLocalDateTimeBuilder,
	GraphQLLocalTimeBuilder,
	GraphQLMediaImageBuilder,
	GraphQLMetaFieldsBuilder,
	GraphQLStringBuilder,
} from '/lib/types';
import {mockImage} from '../mocks/mockImage';
import {mockLibUtil} from '../mocks/mockLibUtil';
import {mockLibXpContext} from '../mocks/mockLibXpContext';
import {mockLibXpNode} from '../mocks/mockLibXpNode';

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

const folderContent: BaseFolder = {
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

mockLibUtil();

const folderMetaFields: MetaFields = {
	canonical: null,
	description: 'seoDescription',
	// image: imageContent,
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
	title: 'folderContentDisplayName - siteContentDisplayName',
	twitter: {
		hideImages: true,
		site: '@twitterUsername',
	},
	verification: {
		google: 'siteVerification'
	},
	url: '/folderContentPath'
};

const graphQLContent = GraphQLContentBuilder.from(siteContent);

const graphQL: GraphQL = {
	GraphQLBoolean: GraphQLBooleanBuilder.from(true),
	GraphQLInt: GraphQLIntBuilder.from(1),
	GraphQLString: GraphQLStringBuilder.from('string'),
	GraphQLID: GraphQLIDBuilder.from('id'),
	GraphQLFloat: GraphQLFloatBuilder.from(1.1),
	Json: GraphQLJsonBuilder.from('{"json": "value"}'),
	DateTime: GraphQLDateTimeBuilder.from('2021-01-01T00:00:00Z'),
	Date: GraphQLDateBuilder.from('2021-01-01'),
	LocalTime: GraphQLLocalTimeBuilder.from('00:00:00'),
	LocalDateTime: GraphQLLocalDateTimeBuilder.from('2021-01-01T00:00:00'),
	nonNull: (type) => type,
	list: (type) => [type],
	reference: (typeName) => {
		// console.debug('reference typeName', typeName);
		if (typeName === 'media_Image') {
			return GraphQLMediaImageBuilder.from(imageContent);
		}
		if (typeName === 'MetaFields') {
			return GraphQLMetaFieldsBuilder.from(folderMetaFields);
		}
		return graphQLContent;
	},
};

describe('guillotine extensions', () => {
	beforeAll(() => {
		jest.mock(
			'/lib/xp/content',
			() => ({
				getSite: jest.fn<typeof ContentGetSite>().mockReturnValue(siteContent),
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

	it("does it's thing", () => {
		import('/guillotine/guillotine').then(({extensions}) => {
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
							canonical: {type: 'string'},
							description: {type: "string"},
							image: {
								type: imageContent
							},
							locale: {type: "string"},
							openGraph: {type: '{"json": "value"}'},
							robots: {type: '{"json": "value"}'},
							siteName: {type: "string"},
							title: {type: "string"},
							twitter: {type: '{"json": "value"}'},
							verification: {type: '{"json": "value"}'},
							url: {type: 'string'},
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
			expect(contentFunction(params)).toBeUndefined();
			expect(contentMetaFieldsResolver({
				args: {},
				localContext: {
					branch: 'master',
					project: 'project'
				},
				source: folderContent
			})).toEqual({
				_appOrSiteConfig: metaFieldsSiteConfig,
				_content: folderContent,
				_siteOrNull: siteContent,
				...folderMetaFields
			});
			// expect(metaFieldsImagesResolver({}));
		}); // import
	}); // it
}); // describe
