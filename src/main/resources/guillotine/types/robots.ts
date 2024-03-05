import type {GraphQL} from '@enonic-types/guillotine';


export const buildRobots = (graphQL: GraphQL) => ({
	description: 'Meta fields for Robots',
	fields: {
		follow: {
			type: graphQL.GraphQLBoolean,
		},
		index: {
			type: graphQL.GraphQLBoolean,
		},
	}
});
