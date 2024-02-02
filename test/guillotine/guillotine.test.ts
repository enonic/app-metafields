import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig';
import type {
	Content,
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
	BaseFolder,
	GraphQL,
	GraphQLBoolean,
	GraphQLContent,
	GraphQLID,
	GraphQLInt,
	GraphQLFloat,
	GraphQLJson,
	GraphQLDateTime,
	GraphQLDate,
	GraphQLLocalTime,
	GraphQLLocalDateTime,
	GraphQLMediaImage,
	GraphQLMetaFields,
	GraphQLString,
	MediaImage,
	MetaFields
} from '/guillotine/guillotine.d';
// import type {Brand} from '/lib/brand.d';


import {
	beforeAll,
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';
import {brand} from '/lib/brand';

// @ts-ignore
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

const imageContent: MediaImage = {
	_id: 'imageContentId',
	_name: 'imageContentName',
	_path: 'imageContentPath',
	attachments: {},
	creator: 'user:system:creator',
	createdTime: '2021-01-01T00:00:00Z',
	data: {
		media: {
			attachment: 'image.jpg',
			focalPoint: {
				x: 25,
				y: 50
			},
		}
	},
	displayName: 'imageContentDisplayName',
	owner: 'user:system:owner',
	type: 'media:image',
	hasChildren: false,
	valid: true,
	x: {},
}

jest.mock(
	'/lib/xp/context',
	() => ({
		get: jest.fn<typeof getContext>().mockReturnValue({
			attributes: {},
			authInfo: {
				principals: [],
				user: {
					login: 'login',
					idProvider: 'idProvider',
					type: 'user',
					key: 'user:idProvder:name',
					displayName: 'userDisplayName',
				},
			},
			branch: 'master',
			repository: 'repository'
		}),
		run: jest.fn<typeof run>((_context, callback) => callback())
	}),
	{virtual: true}
);

jest.mock(
	'/lib/xp/portal',
	() => ({
		getSiteConfig: jest.fn<typeof getSiteConfig<MetafieldsSiteConfig>>().mockReturnValue(metaFieldsSiteConfig)
	}),
	{virtual: true}
);

jest.mock(
	'/lib/util',
	() => ({
		app: {
			getJsonName: () => 'com-enonic-app-metafields',
		}
	}),
	{virtual: true}
);

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

const graphQLContent = brand<GraphQLContent>().from(siteContent);

const graphQL: GraphQL = {
	GraphQLBoolean: brand<GraphQLBoolean>().from(true),
	GraphQLInt: brand<GraphQLInt>().from(1),
	GraphQLString: brand<GraphQLString>().from('string'),
	GraphQLID: brand<GraphQLID>().from('id'),
	GraphQLFloat: brand<GraphQLFloat>().from(1.1),
	Json: brand<GraphQLJson>().from('{"json": "value"}'),
	DateTime: brand<GraphQLDateTime>().from('2021-01-01T00:00:00Z'),
	Date: brand<GraphQLDate>().from('2021-01-01'),
	LocalTime: brand<GraphQLLocalTime>().from('00:00:00'),
	LocalDateTime: brand<GraphQLLocalDateTime>().from('2021-01-01T00:00:00'),
	nonNull: (type) => type,
	list: (type) => type,
	reference: (typeName) => {
		console.debug('reference typeName', typeName);
		if (typeName === 'media_Image') {
			return brand<GraphQLMediaImage>().from(imageContent);
		}
		if (typeName === 'MetaFields') {
			return brand<GraphQLMetaFields>().from(folderMetaFields);
		}
		return graphQLContent;
	},
};

describe('guillotine extensions', () => {
	beforeAll(() => {
		jest.mock(
			'/lib/xp/content',
			() => ({
				getSite: jest.fn<typeof ContentGetSite>().mockReturnValue(siteContent)
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
