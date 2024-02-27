import type {
	GraphQL,
	Extensions,
} from '@enonic-types/guillotine';


import {ObjectTypeName} from '@enonic-types/guillotine';
import {contentMetaFieldsResolver} from '/guillotine/typeFieldResolvers/contentMetaFieldsResolver';
import {metaFieldsImagesResolver} from '/guillotine/typeFieldResolvers/metaFieldsImagesResolver';


// In type names first letter should be uppercase
const enum GraphQLTypeName {
	METAFIELDS = 'MetaFields',
}

// In fields names first letter should be lowercase
const enum GraphQLFieldName {
	IMAGE = 'image',
	METAFIELDS = 'metaFields',
}


export const extensions = (graphQL: GraphQL): Extensions => {
	return {
		types: {
			[GraphQLTypeName.METAFIELDS]: {
				description: 'Meta fields for a content',
				fields: {
					canonical: {
						type: graphQL.GraphQLString,
					},
					description: {
						type: graphQL.GraphQLString,
					},
					fullTitle: {
						type: graphQL.nonNull(graphQL.GraphQLString),
					},
					locale: {
						type: graphQL.GraphQLString,
					},
					image: {
						type: graphQL.reference(ObjectTypeName.media_Image),
					},
					openGraph: {
						type: graphQL.Json,
					},
					robots: {
						type: graphQL.Json,
					},
					siteName: {
						type: graphQL.GraphQLString, // can be null
					},
					title: {
						type: graphQL.nonNull(graphQL.GraphQLString),
					},
					twitter: {
						type: graphQL.Json,
					},
					url: {
						type: graphQL.nonNull(graphQL.GraphQLString),
					},
					verification: {
						type: graphQL.Json,
					},
				}
			}
		},
		creationCallbacks: {
			[ObjectTypeName.Content]: (params) => {
				params.addFields({
					[GraphQLFieldName.METAFIELDS]: {
						type: graphQL.reference(GraphQLTypeName.METAFIELDS)
					}
				});
			}
		},
		resolvers: {
			[ObjectTypeName.Content]: {
				[GraphQLFieldName.METAFIELDS]: contentMetaFieldsResolver,
			},
			[GraphQLTypeName.METAFIELDS]: {
				[GraphQLFieldName.IMAGE]: metaFieldsImagesResolver
			}
		},
	}
};
