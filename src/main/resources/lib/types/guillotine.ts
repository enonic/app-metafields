import type {Content} from '@enonic-types/lib-content';
import type {Branded} from '/lib/types/Branded';
import type {MediaImage} from '/lib/types/Content';


// In type names first letter should be uppercase
export const enum GraphQLTypeName {
	CONTENT = 'Content',
	MEDIA_IMAGE = 'media_Image',
	METAFIELDS = 'MetaFields',
}

// In fields names first letter should be lowercase
export interface MetaFields {
	alternates?: {
		canonical?: string
	},
	description?: string
	image?: MediaImage|null
	locale?: string
	openGraph?: {
		hideImages?: boolean
		hideUrl?: boolean
		type?: 'website' | 'article'
	}
	robots?: {
		follow?: boolean
		index?: boolean
	}
	siteName: string
	title: string
	twitter?: {
		hideImages?: boolean
		site?: string
	}
	verification?: {
		google?: string
	}
	url: string
}

export type GraphQLContent = Branded<Content, 'Content'>
export type GraphQLMediaImage = Branded<MediaImage, 'media_Image'>
export type GraphQLMetaFields = Branded<MetaFields, 'MetaFields'>

// In fields names first letter should be lowercase
export const enum GraphQLFieldName {
	IMAGE = 'image',
	METAFIELDS = 'metaFields',
}

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

export type GraphQLString = Branded<string, 'GraphQLString'>
export type GraphQLInt = Branded<number, 'GraphQLInt'>
export type GraphQLID = Branded<string, 'GraphQLID'>
export type GraphQLBoolean = Branded<boolean, 'GraphQLBoolean'>
export type GraphQLFloat = Branded<number, 'GraphQLFloat'>
export type GraphQLJson = Branded<string, 'Json'>
export type GraphQLDateTime = Branded<string, 'DateTime'>
export type GraphQLDate = Branded<string, 'Date'>
export type GraphQLLocalTime = Branded<string, 'LocalTime'>
export type GraphQLLocalDateTime = Branded<string, 'LocalDateTime'>

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
	list: (type: GraphQLType) => GraphQLType[]
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
	values: Record<string, string> // /^_A-Za-z(_A-Za-z0-9)*/
}

interface ExtensionType {
	description: string
	fields: Record<string, {
		type: GraphQLType | GraphQLType[]
	}>
}

type LocalContext<
	T extends Record<string,string|number|boolean|null> = Record<string,string|number|boolean|null>
> = {
	branch: string
	project: string
	siteKey?: string
} & T

interface XpXDataMetaData {
	blockRobots?: boolean
	seoContentForCanonicalUrl?: string
	seoDescription?: string
	seoImage?: string
	seoTitle?: string
}

interface DataFetchingEnvironment<
	ARGS extends Record<string, any> = Record<string, any>,
	SOURCE extends Record<string, any> = Record<string, any>,
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

export interface Resolver<
	ARGS extends Record<string, any> = Record<string, any>,
	SOURCE extends Record<string, any> = Record<string, any>,
	RETURN = any
> {
	(env: DataFetchingEnvironment<ARGS,SOURCE>): RETURN
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
