import type {GraphQL} from '@enonic-types/guillotine';


export const buildVerification = (graphQL: GraphQL) => ({
	description: 'Meta fields for Verification',
	fields: {
		google: {
			type: graphQL.GraphQLString,
		},
	}
});
