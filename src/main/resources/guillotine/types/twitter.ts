import type {GraphQL} from '@enonic-types/guillotine';


export const buildTwitter = (graphQL: GraphQL) => ({
	description: 'Meta fields for Twitter',
	fields: {
		hideImages: {
			type: graphQL.GraphQLBoolean,
		},
		site: {
			type: graphQL.GraphQLString,
		},
	}
});
