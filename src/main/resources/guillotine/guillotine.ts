// import type {Guillotine} from '@enonic-types/guillotine';
// import type {MetaFieldFields} from '/guillotine/guillotine.d';

import type {
	Extensions,
	GraphQL,
} from '/lib/app-metafields/types/guillotine';


import {GraphQLFieldName, GraphQLTypeName} from '/lib/app-metafields/types/guillotine';
import {contentMetaFieldsResolver} from '/guillotine/typeFieldResolvers/contentMetaFieldsResolver';
import {metaFieldsImagesResolver} from '/guillotine/typeFieldResolvers/metaFieldsImagesResolver';


export const extensions = (graphQL: GraphQL): Extensions => {
	return {
		types: {
			[GraphQLTypeName.METAFIELDS]: {
				description: 'Meta fields for a content',
				fields: /*<MetaFieldFields>*/{
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
						type: graphQL.reference(GraphQLTypeName.MEDIA_IMAGE),
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
			[GraphQLTypeName.CONTENT]: (params) => {
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
				[GraphQLFieldName.IMAGE]: metaFieldsImagesResolver
			}
		},
	}
};
