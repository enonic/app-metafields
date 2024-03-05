export type {
	CommaSeparatedString,
	ImageId,
} from '/lib/app-metafields/types/Content';


export declare interface MetafieldsSiteConfig {
	baseUrl?: string
	blockRobots?: boolean
	fullPath?: boolean
	pathsDescriptions?: CommaSeparatedString|CommaSeparatedString[]
	pathsImages?: CommaSeparatedString|CommaSeparatedString[]
	pathsTitles?: CommaSeparatedString|CommaSeparatedString[]
	seoDescription?: string
	seoImage?: ImageId
	seoImageIsPrescaled?: boolean
	siteVerification?: string
	removeOpenGraphImage?: boolean
	removeOpenGraphUrl?: boolean
	removeTwitterImage?: boolean
	titleBehaviour?: boolean
	titleFrontpageBehaviour?: boolean
	titleSeparator?: string
	twitterUsername?: string
	[x: string]: unknown // Hack to satisfy Record<string, unknown>
}
