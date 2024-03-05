import type {GraphQL} from '@enonic-types/guillotine';


export const buildOpenGraph = (graphQL: GraphQL) => ({
	description: 'Meta fields for Open Graph',
	fields: {
		hideImages: {
			type: graphQL.GraphQLBoolean,
		},
		hideUrl: {
			type: graphQL.GraphQLBoolean,
		},
		type: {
			type: graphQL.GraphQLString,
		},
	}
});
