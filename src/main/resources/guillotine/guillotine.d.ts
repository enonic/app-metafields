// import type {Content} from '@enonic-types/lib-content';
import type {Branded} from '/lib/brand.d';

export const enum GraphQLTypeName {
	CONTENT = 'Content',
	// IMAGE = 'Image',
	// IMAGE_STYLE = 'ImageStyle',
	METAFIELDS = 'MetaFields'
}

export const enum GraphQLFieldName {
	METAFIELDS = 'metaFields'
}

type PartialRecord<K extends keyof any, T> = {
	[P in K]?: T;
};

type GraphQLString = Branded<string, 'GraphQLString'>
type GraphQLInt = Branded<number, 'GraphQLInt'>
type GraphQLID = Branded<string, 'GraphQLID'>
type GraphQLBoolean = Branded<boolean, 'GraphQLBoolean'>
type GraphQLFloat = Branded<number, 'GraphQLFloat'>
type GraphJson = Branded<string, 'Json'>
type GraphDateTime = Branded<string, 'DateTime'>
type GraphDate = Branded<string, 'Date'>
type GraphLocalTime = Branded<string, 'LocalTime'>
type GraphLocalDateTime = Branded<string, 'LocalDateTime'>

type GraphQLType =
	| GraphQLString
	| GraphQLInt
	| GraphQLID
	| GraphQLBoolean
	| GraphQLFloat
	| GraphJson
	| GraphDateTime
	| GraphDate
	| GraphLocalTime
	| GraphLocalDateTime

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

interface Content {
	_id: string
	_path: string
	data?: Record<string, any>
	x: Record<string, {
		'meta-data': XpXDataMetaData
	}>
}

interface Env <
	ARGS extends Record<string, any> = Record<string, any>,
	SOURCE extends Record<string, any> = Content
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
	SOURCE extends Record<string, any> = Content,
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
