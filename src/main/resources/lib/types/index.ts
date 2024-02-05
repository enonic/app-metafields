//──────────────────────────────────────────────────────────────────────────────
// Type imports
//──────────────────────────────────────────────────────────────────────────────
import type {
	CommaSeparatedString,
	ImageId,
} from '/lib/types/Content';
import type {
	GraphQLBoolean,
	GraphQLContent,
	GraphQLID,
	GraphQLInt,
	GraphQLFloat,
	GraphQLJson,
	GraphQLDateTime,
	GraphQLDate,
	GraphQLLocalTime,
	GraphQLLocalDateTime,
	GraphQLMediaImage,
	GraphQLMetaFields,
	GraphQLString,
} from '/lib/types/guillotine';


//──────────────────────────────────────────────────────────────────────────────
// Value imports
//──────────────────────────────────────────────────────────────────────────────
import {brand} from '/lib/types/brand';


//──────────────────────────────────────────────────────────────────────────────
// Exported types
//──────────────────────────────────────────────────────────────────────────────
export type {
	BaseFolder,
	CommaSeparatedString,
	ImageId,
	MediaImage,
} from '/lib/types/Content';
export type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';


//──────────────────────────────────────────────────────────────────────────────
// Exported values
//──────────────────────────────────────────────────────────────────────────────
export const CommaSeparatedStringBuilder = brand<CommaSeparatedString>();
export const ImageIdBuilder = brand<ImageId>();

export const GraphQLBooleanBuilder = brand<GraphQLBoolean>();
export const GraphQLDateBuilder = brand<GraphQLDate>();
export const GraphQLDateTimeBuilder = brand<GraphQLDateTime>();
export const GraphQLFloatBuilder = brand<GraphQLFloat>();
export const GraphQLIDBuilder = brand<GraphQLID>();
export const GraphQLIntBuilder = brand<GraphQLInt>();
export const GraphQLJsonBuilder = brand<GraphQLJson>();
export const GraphQLLocalDateTimeBuilder = brand<GraphQLLocalDateTime>();
export const GraphQLLocalTimeBuilder = brand<GraphQLLocalTime>();
export const GraphQLStringBuilder = brand<GraphQLString>();

export const GraphQLContentBuilder = brand<GraphQLContent>();
export const GraphQLMediaImageBuilder = brand<GraphQLMediaImage>();
export const GraphQLMetaFieldsBuilder = brand<GraphQLMetaFields>();
