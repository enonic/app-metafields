import type {
	Extensions,
	GraphQL,
} from '../lib/types/Guillotine';


import {GraphQLFieldName, GraphQLTypeName} from '../lib/types/Guillotine';
import {contentMetaFieldsResolver} from '/guillotine/typeFieldResolvers/contentMetaFieldsResolver';
import {metaFieldsImagesResolver} from '/guillotine/typeFieldResolvers/metaFieldsImagesResolver';


export const extensions = (graphQL: GraphQL): Extensions => {
	return {
		types: {
			[GraphQLTypeName.METAFIELDS]: {
				description: 'Meta fields for a content',
				fields: {
					alternates: {
						type: graphQL.Json,
					},
					description: {
						type: graphQL.GraphQLString,
					},
					locale: {
						type: graphQL.GraphQLString,
					},
					images: {
						type: graphQL.list(graphQL.reference(GraphQLTypeName.MEDIA_IMAGE)),
					},
					openGraph: {
						type: graphQL.Json,
					},
					robots: {
						type: graphQL.Json,
					},
					siteName: {
						type: graphQL.GraphQLString,
					},
					title: {
						type: graphQL.nonNull(graphQL.GraphQLString),
					},
					twitter: {
						type: graphQL.Json,
					},
					verification: {
						type: graphQL.Json,
					},
				}
			}
		},
		creationCallbacks: {
			[GraphQLTypeName.CONTENT]: function (params) {
				params.addFields({
					[GraphQLFieldName.METAFIELDS]: {
						type: graphQL.reference(GraphQLTypeName.METAFIELDS)
					}
				});
			}
		},
		resolvers: {
			[GraphQLTypeName.CONTENT]: {
				[GraphQLFieldName.METAFIELDS]: contentMetaFieldsResolver,
			},
			[GraphQLTypeName.METAFIELDS]: {
				[GraphQLFieldName.IMAGES]: metaFieldsImagesResolver
			}
		},
	}
};
