import type {
	// GraphQLBoolean,
	// GraphQLDate,
	// GraphQLDateTime,
	// GraphQLFloat,
	// GraphQLID,
	// GraphQLInt,
	GraphQLJson,
	// GraphQLLocalDateTime,
	// GraphQLLocalTime,
	GraphQLReference,
	GraphQLString,
	GraphQLTypeToGuillotineFields,
	Guillotine,
} from '@enonic-types/guillotine';


export declare interface GraphQLMetafields {
	canonical?: GraphQLString
	description?: GraphQLString
	locale?: GraphQLString
	//image?: GraphQLReference<GraphQLMediaImage>
	openGraph?: GraphQLJson
	robots?: GraphQLJson
	siteName?: GraphQLString // Can be null
	title: GraphQLString
	twitter?: GraphQLJson
	verification?: GraphQLJson
	url: GraphQLString
}

export declare type MetaFieldFields = GraphQLTypeToGuillotineFields<GraphQLMetafields>


declare global {
	interface GraphQLTypesMap {
		MetaFields: GraphQLMetafields
	}
	interface GraphQLTypeFieldsMap {
		Content: {
			metaFields: GraphQLMetafields
		}
		MetaFields: {
			image: unknown // GraphQLMediaImage
		}
	}
} // global
