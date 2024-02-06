//──────────────────────────────────────────────────────────────────────────────
// Type imports
//──────────────────────────────────────────────────────────────────────────────
import type {Content} from '@enonic-types/lib-content';
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
import {isString} from '../common/isString';


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
export type {Request} from '/lib/types/Request';
export type {Response} from '/lib/types/Response';


//──────────────────────────────────────────────────────────────────────────────
// Exported values
//──────────────────────────────────────────────────────────────────────────────
function isBoolean(value :unknown) :value is boolean {
	return Object.prototype.toString.call(value).slice(8,-1) === 'Boolean';
}

function isFunction<FunctionShape extends Function>(value: unknown) :value is FunctionShape {
	return Object.prototype.toString.call(value).slice(8,-1) === 'Function';
}

function isInt(value: unknown): boolean {
	return typeof value === 'number' &&
		isFinite(value as number) &&
		Math.floor(value as number) === value;
}

function isNumber(value :number | unknown) :value is number {
	return typeof value === 'number' && isFinite(value);
}

const isObject = (value: object | unknown): value is object =>
	Object.prototype.toString.call(value).slice(8,-1) === 'Object';


const jsonValidator = (value: unknown) => isString(value) && !!JSON.parse(value.toString()) // Empty object or array is truthy :)

const intValidator = (value: unknown): value is number => isNumber(value)
	&& (('isInteger' in Number) && isFunction(Number.isInteger))
		? Number.isInteger(value)
		: isInt(value);

export const CommaSeparatedStringBuilder = brand<CommaSeparatedString>({
	validate: isString
});

export const ImageIdBuilder = brand<ImageId>({
	validate: isString
});

export const GraphQLBooleanBuilder = brand<GraphQLBoolean>({
	validate: isBoolean
});

export const GraphQLDateBuilder = brand<GraphQLDate>({
	validate: isString
});

export const GraphQLDateTimeBuilder = brand<GraphQLDateTime>({
	validate: isString
});

export const GraphQLFloatBuilder = brand<GraphQLFloat>({
	validate: isNumber
});

export const GraphQLIDBuilder = brand<GraphQLID>({
	validate: isString
});

export const GraphQLIntBuilder = brand<GraphQLInt>({
	validate: intValidator
});

export const GraphQLJsonBuilder = brand<GraphQLJson>({
	validate: jsonValidator
});

export const GraphQLLocalDateTimeBuilder = brand<GraphQLLocalDateTime>({
	validate: isString
});

export const GraphQLLocalTimeBuilder = brand<GraphQLLocalTime>({
	validate: isString
});

export const GraphQLStringBuilder = brand<GraphQLString>({
	validate: isString
});

const contentValidator = (value: unknown): value is Content => isObject(value)
	// Might be too strict at runtime?
	// && value.hasOwnProperty('_id')
	// && value.hasOwnProperty('_name')
	// && value.hasOwnProperty('_path')
	// && value.hasOwnProperty('attachments')
	// && value.hasOwnProperty('creator') // TODO could be more specific
	// && value.hasOwnProperty('createdTime') // TODO could be more specific
	// && value.hasOwnProperty('data')
	// && value.hasOwnProperty('displayName')
	// && value.hasOwnProperty('owner')
	&& value.hasOwnProperty('type') && isString((value as Content).type)
	// && value.hasOwnProperty('hasChildren') && isBoolean(value['hasChildren'])
	// && value.hasOwnProperty('valid') && isBoolean(value['valid'])
	// && value.hasOwnProperty('x')
	// TODO Check optional fields?
	;

export const GraphQLContentBuilder = brand<GraphQLContent>({
	validate: contentValidator
});

const mediaImageValidator = (value: unknown)/*: value is MediaImage*/ => contentValidator(value) &&
	value['type'] !== 'media:image'
		? `expected content.type to be 'media:image' got '${value['type']}' content:${JSON.stringify(value, null, 4)}`
		: true

export const GraphQLMediaImageBuilder = brand<GraphQLMediaImage>({
	validate: mediaImageValidator
});

const metaFieldsValidator = (value: unknown)/*: value is GraphQLMetaFields*/ => isObject(value)
	&& !value.hasOwnProperty('siteName')
		? `expected object to have property 'siteName' object:${JSON.stringify(value, null, 4)}`
		: !isString((value as GraphQLMetaFields)['siteName'])
			? `expected object.siteName to be a string got ${(value as GraphQLMetaFields)['siteName']} object:${JSON.stringify(value, null, 4)}`
			: !value.hasOwnProperty('title')
				? `expected object to have property 'title' object:${JSON.stringify(value, null, 4)}`
				: !isString((value as GraphQLMetaFields)['siteName'])
					? `expected object.siteName to be a string got ${(value as GraphQLMetaFields)['siteName']} object:${JSON.stringify(value, null, 4)}`
					: true


export const GraphQLMetaFieldsBuilder = brand<GraphQLMetaFields>({
	validate: metaFieldsValidator
});
