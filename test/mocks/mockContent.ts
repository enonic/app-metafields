import type {
	Attachment,
	Content,
} from '/lib/xp/content';


export function mockContent({
	attachments = {},
	data = {},
	prefix,
	type
}: {
	attachments?: Record<string, Attachment>
	data?: Record<string, unknown>
	prefix: string
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
		owner: 'user:system:owner',
		type,
		hasChildren: false,
		valid: true,
		x: {},
	}
}
