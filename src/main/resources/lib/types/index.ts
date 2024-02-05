//──────────────────────────────────────────────────────────────────────────────
// Type imports
//──────────────────────────────────────────────────────────────────────────────
import type {Content} from '@enonic-types/lib-content';
import type {Branded} from '/lib/types/Branded';
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
} from '/lib/types/Guillotine';


//──────────────────────────────────────────────────────────────────────────────
// Value imports
//──────────────────────────────────────────────────────────────────────────────
import {brand} from '/lib/types/brand';


//──────────────────────────────────────────────────────────────────────────────
// ExportedtTypes
//──────────────────────────────────────────────────────────────────────────────
export type {MetafieldsSiteConfig} from '/lib/types/MetafieldsSiteConfig';

export declare type BaseFolder = Content<{}, 'base:folder'>;

export declare type ImageId = Branded<string, 'ImageId'>;

export declare type MediaImage = Content<{
	media: {
		altText?: string
		artist?: string
		attachment: string
		caption?: string
		copyright?: string
		focalPoint: {
			x: number
			y: number
		}
		tags?: string // with comma?
	}
}, 'media:image'>;

//──────────────────────────────────────────────────────────────────────────────
// Exported values
//──────────────────────────────────────────────────────────────────────────────
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
