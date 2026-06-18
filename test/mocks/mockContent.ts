import type {
	Attachment,
	Content,
} from '/lib/xp/content';


export function mockContent({
	attachments = {},
	data = {},
	modifiedTime,
	prefix,
	publish,
	type
}: {
	attachments?: Record<string, Attachment>
	data?: Record<string, unknown>
	modifiedTime?: string
	prefix: string
	publish?: Content['publish']
	type: string
}): Content {
	return {
		_id: `${prefix}ContentId`,
		_name: `${prefix}ContentName`,
		_path: `${prefix}ContentPath`,
		attachments,
		creator: 'user:system:creator',
		createdTime: '2021-01-01T00:00:00Z',
		data,
		displayName: `${prefix}ContentDisplayName`,
		...(modifiedTime ? {modifiedTime} : {}),
		owner: 'user:system:owner',
		...(publish ? {publish} : {}),
		type,
		hasChildren: false,
		valid: true,
		x: {},
	}
}
