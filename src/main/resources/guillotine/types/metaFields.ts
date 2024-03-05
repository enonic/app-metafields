import type {GraphQL} from '@enonic-types/guillotine';


import {ObjectTypeName} from '@enonic-types/guillotine';
import {GraphQLTypeName} from '/guillotine/constants';


export const buildMetaFields = (graphQL: GraphQL) => ({
	description: 'Meta fields for a content',
	fields: {
		baseUrl: {
			type: graphQL.GraphQLString,
		},
		canonical: {
			type: graphQL.reference(ObjectTypeName.Content),
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
			type: graphQL.reference(GraphQLTypeName.METAFIELDS_OPEN_GRAPH),
		},
		robots: {
			type: graphQL.reference(GraphQLTypeName.METAFIELDS_ROBOTS),
		},
		siteName: {
			type: graphQL.GraphQLString, // can be null
		},
		title: {
			type: graphQL.nonNull(graphQL.GraphQLString),
		},
		twitter: {
			type: graphQL.reference(GraphQLTypeName.METAFIELDS_TWITTER),
		},
		verification: {
			type: graphQL.reference(GraphQLTypeName.METAFIELDS_VERIFICATION),
		},
	}
});
