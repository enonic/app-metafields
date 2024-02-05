export type {
	BaseFolder,
	ImageId,
	MediaImage,
} from '/lib/types/Content';


export interface MetafieldsSiteConfig {
	blockRobots?: boolean
	canonical?: boolean
	disableAppConfig?: boolean
	fullPath?: boolean
	headless?: boolean
	pathsDescriptions?: string // with comma
	pathsImages?: string // with comma
	pathsTitles?: string // with comma
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
