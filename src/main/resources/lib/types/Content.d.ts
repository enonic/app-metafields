export declare type BaseFolder = Content<{}, 'base:folder'>;

export declare type CommaSeparatedString = Branded<string, 'CommaSeparatedString'>;

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
