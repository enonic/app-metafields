import type {Content} from '@enonic-types/lib-content';
import type {Branded} from '/lib/brand.d';


export declare type BaseFolder = Content<{}, 'base:folder'>;

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

export const enum GraphQLTypeName {
	CONTENT = 'Content',
	// IMAGE = 'Image',
	// IMAGE_STYLE = 'ImageStyle',
	MEDIA_IMAGE = 'media_Image',
	METAFIELDS = 'MetaFields',
}

export interface MetaFields {
	alternates?: {
		canonical?: string
	}, // string
	description?: string
	images?: MediaImage[]
	locale?: string
	openGraph?: {
		type?: 'website' | 'article'
	} // string
	robots?: {
		follow?: boolean
		index?: boolean
	} // string
	siteName: string
	title: string
	twitter?: {
		creator?: string
	} // string
	verification?: {
		google?: string
	} // string
}

type GraphQLContent = Branded<Content, 'Content'>
type GraphQLMediaImage = Branded<MediaImage, 'media_Image'>
type GraphQLMetaFields = Branded<MetaFields, 'MetaFields'>

export const enum GraphQLFieldName {
	IMAGES = 'images',
	METAFIELDS = 'metaFields',
}

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

type GraphQLString = Branded<string, 'GraphQLString'>
type GraphQLInt = Branded<number, 'GraphQLInt'>
type GraphQLID = Branded<string, 'GraphQLID'>
type GraphQLBoolean = Branded<boolean, 'GraphQLBoolean'>
type GraphQLFloat = Branded<number, 'GraphQLFloat'>
type GraphQLJson = Branded<string, 'Json'>
type GraphQLDateTime = Branded<string, 'DateTime'>
type GraphQLDate = Branded<string, 'Date'>
type GraphQLLocalTime = Branded<string, 'LocalTime'>
type GraphQLLocalDateTime = Branded<string, 'LocalDateTime'>

type GraphQLType =
	| GraphQLString
	| GraphQLInt
	| GraphQLID
	| GraphQLBoolean
	| GraphQLFloat
	| GraphQLJson
	| GraphQLDateTime
	| GraphQLDate
	| GraphQLLocalTime
	| GraphQLLocalDateTime
	// Extensions:
	| GraphQLContent
	| GraphQLMediaImage
	| GraphQLMetaFields

type GraphQLTypes =
	|'GraphQLString'
	|'GraphQLInt'
	|'GraphQLID'
	|'GraphQLBoolean'
	|'GraphQLFloat'
	|'Json'
	|'DateTime'
	|'Date'
	|'LocalTime'
	|'LocalDateTime'

export type GraphQL = Record<GraphQLTypes, GraphQLType> & {
	nonNull: (type: GraphQLType) => GraphQLType
	list: (type: GraphQLType) => GraphQLType
	reference: (type: GraphQLTypeName) => GraphQLType
}

interface CreationCallback {
	(params: {
		addFields: (fields: Record<string, {
			type: GraphQLType
		}>) => void
	}): void
}

interface ExtensionEnum {
	description: string
	values: Record<string, string>
}

interface ExtensionType {
	description: string
	fields: Record<string, {
		type: GraphQLType
	}>
}

interface LocalContext {
	branch: string
	project: string
	siteKey?: string
}

interface XpXDataMetaData {
	blockRobots?: boolean
	seoContentForCanonicalUrl?: string
	seoDescription?: string
	seoImage?: string
	seoTitle?: string
}

// type Content = Omit<ImportedContent,'x'> & {
// 	x: Record<string, {
// 		'meta-data': XpXDataMetaData
// 	}>
// }

// interface Content extends ImportedContent {
// 	// _id: string
// 	// _path: string
// 	data?: Record<string, any>
// 	x: Record<string, {
// 		'meta-data': XpXDataMetaData
// 	}>
// }

interface Env <
	ARGS extends Record<string, any> = Record<string, any>,
	SOURCE extends Record<string, any> = Record<string, any> // Content
> {
	args: ARGS
	localContext: LocalContext
	source: SOURCE
}

interface MetafieldsResolverReturnType {
	description?: string
	openGraph?: any
	robots?: any
	title: string
	twitter?: any
	verification?: any
}

interface Resolver<
	ARGS extends Record<string, any> = Record<string, any>,
	SOURCE extends Record<string, any> = Record<string, any>, // Content,
	RETURN = any
> {
	(env: Env<ARGS,SOURCE>): RETURN
}

export interface Extensions {
	inputTypes?: Record<string, any>
	enums?: Record<string, ExtensionEnum>
	interfaces?: Record<string, any>
	unions?: Record<string, any>
	types?: Record<string, ExtensionType>
	creationCallbacks?: Record<string, CreationCallback>
	resolvers?: PartialRecord<GraphQLTypeName, PartialRecord<GraphQLFieldName, Resolver>>
	typeResolvers?: Record<string, any>
}
