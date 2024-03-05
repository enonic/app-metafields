import type {
	GraphQL,
	Extensions,
} from '@enonic-types/guillotine';


import {ObjectTypeName} from '@enonic-types/guillotine';
import {
	GraphQLFieldName,
	GraphQLTypeName,
} from '/guillotine/constants';
import {buildContentMetaFieldsResolver} from '/guillotine/typeFieldResolvers/buildContentMetaFieldsResolver';
import {metaFieldsImagesResolver} from '/guillotine/typeFieldResolvers/metaFieldsImagesResolver';
import {buildMetaFields} from '/guillotine/types/metaFields';
import {buildOpenGraph} from '/guillotine/types/openGraph';
import {buildRobots} from '/guillotine/types/robots';
import {buildTwitter} from '/guillotine/types/twitter';
import {buildVerification} from '/guillotine/types/verification';


export const extensions = (graphQL: GraphQL): Extensions => {
	return {
		types: {
			[GraphQLTypeName.METAFIELDS]: buildMetaFields(graphQL),
			[GraphQLTypeName.METAFIELDS_OPEN_GRAPH]: buildOpenGraph(graphQL),
			[GraphQLTypeName.METAFIELDS_ROBOTS]: buildRobots(graphQL),
			[GraphQLTypeName.METAFIELDS_TWITTER]: buildTwitter(graphQL),
			[GraphQLTypeName.METAFIELDS_VERIFICATION]: buildVerification(graphQL),
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
				[GraphQLFieldName.METAFIELDS]: buildContentMetaFieldsResolver(graphQL),
			},
			[GraphQLTypeName.METAFIELDS]: {
				[GraphQLFieldName.IMAGE]: metaFieldsImagesResolver
			}
		},
	}
};
