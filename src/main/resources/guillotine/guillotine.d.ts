import type {
	GraphQLJson,
	GraphQLReference,
	GraphQLString,
	MediaImageContent,
} from '@enonic-types/guillotine';
import type {Content, Site} from '@enonic-types/lib-content'
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types/MetafieldsSiteConfig';


export declare interface MetafieldsResult {
	baseUrl?: string
	canonical?: Content|null
	description?: string
	fullTitle: string
	locale?: string
	image?: MediaImageContent|null
	openGraph?: {
		hideImages?: boolean
		hideUrl?: boolean
		type?: 'website' | 'article'
	}
	robots?: {
		follow?: boolean
		index?: boolean
	}
	siteName?: string // Can be null
	title: string
	twitter?: {
		hideImages?: boolean
		site?: string
	}
	verification?: {
		google?: string
	}
}

export declare type ContentMetaFieldsResolverReturnType = Omit<MetafieldsResult,'image'>

export declare type MetaFieldsImagesResolverReturnType = MediaImageContent|null
