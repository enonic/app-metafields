import type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';
import type {
	getSite as ContentGetSite,
	Site
} from '/lib/xp/content';
import type {
	get as getContext,
	run
} from '/lib/xp/context';
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

const folderContent: BaseFolder = {
	_id: 'folderContentId',
	_name: 'folderContentName',
	_path: 'folderContentPath',
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

jest.mock(
	'/lib/xp/portal',
	() => ({
		getSiteConfig: jest.fn<typeof getSiteConfig<MetafieldsSiteConfig>>().mockReturnValue(metaFieldsSiteConfig)
	}),
	{virtual: true}
);

mockLibUtil();

// const siteMetaFields: MetaFields = {
// 	alternates: {
// 		canonical: 'canonical'
// 	},
// 	description: 'string',
// 	images: [imageContent],
// 	locale: 'en_US',
// 	openGraph: {
// 		type: 'website'
// 	},
// 	robots: {
// 		follow: true,
// 		index: true
// 	},
// 	siteName: 'siteContentDisplayName',
// 	title: 'string',
// 	twitter: {
// 		creator: 'string'
// 	},
// 	verification: {
// 		google: 'string'
// 	},
// };

const folderMetaFields: MetaFields = {
	alternates: {
		canonical: null
	},
	description: 'seoDescription',
	// images: [imageContent],
	locale: 'en_US',
	openGraph: {
		type: 'article'
	},
	robots: {
		follow: false,
		index: false
	},
	siteName: 'siteContentDisplayName',
	title: 'folderContentDisplayName - siteContentDisplayName',
	twitter: {
		creator: '@twitterUsername'
	},
	verification: {
		google: 'siteVerification'
	},
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
	list: (type) => type,
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
		// expect(true).toBe(true);
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
						// images: metaFieldsImagesResolver
					}
				},
				types: {
					MetaFields: {
						description: "Meta fields for a content",
						fields: {
							alternates: {type: '{"json": "value"}'},
							description: {type: "string"},
							images: {
								type: imageContent
							},
							locale: {type: "string"},
							openGraph: {type: '{"json": "value"}'},
							robots: {type: '{"json": "value"}'},
							siteName: {type: "string"},
							title: {type: "string"},
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
						images: metaFieldsImagesResolver
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
				_content: folderContent,
				_site: siteContent,
				_siteConfig: metaFieldsSiteConfig,
				...folderMetaFields
			});
			// expect(metaFieldsImagesResolver({}));
		}); // import
	}); // it
}); // describe
