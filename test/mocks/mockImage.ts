import type {MediaImage} from '/lib/types';


import {mockContent} from './mockContent';


export function mockImage({
	mimeType = 'image/jpeg',
	name,
	prefix
}: {
	mimeType?: string
	name: string
	prefix: string
}) {
	return mockContent({
		attachments: {
			[name]: {
				label: `${prefix} label`,
				mimeType,
				name,
				size: 12345,
			}
		},
		data: {
			media: {
				attachment: name,
				focalPoint: {
					x: 25,
					y: 50
				},
			}
		},
		prefix: `${prefix}Image`
	}) as MediaImage;
}
