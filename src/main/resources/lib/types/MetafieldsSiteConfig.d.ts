export type {
	BaseFolder,
	CommaSeparatedString,
	ImageId,
	MediaImage,
} from '/lib/types/Content';


export declare interface MetafieldsSiteConfig {
	baseUrl?: string
	blockRobots?: boolean
	canonical?: boolean
	disableAppConfig?: boolean
	fullPath?: boolean
	pathsDescriptions?: CommaSeparatedString
	pathsImages?: CommaSeparatedString
	pathsTitles?: CommaSeparatedString
	seoDescription?: string
	seoImage?: ImageId
	seoImageIsPrescaled?: boolean
	seoTitle?: string
	siteVerification?: string
	removeOpenGraphImage?: boolean
	removeOpenGraphUrl?: boolean
	removeTwitterImage?: boolean
	titleBehaviour?: boolean
	titleFrontpageBehaviour?: boolean
	titleSeparator?: string
	twitterUsername?: string
}
