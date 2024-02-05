import type {
	get as getContext,
	run
} from '/lib/xp/context';


import {jest} from '@jest/globals';


export function mockLibXpContext() {
	jest.mock(
		'/lib/xp/context',
		() => ({
			get: jest.fn<typeof getContext>().mockReturnValue({
				attributes: {},
				authInfo: {
					principals: [],
					user: {
						login: 'login',
						idProvider: 'idProvider',
						type: 'user',
						key: 'user:idProvder:name',
						displayName: 'userDisplayName',
					},
				},
				branch: 'master',
				repository: 'repository'
			}),
			run: jest.fn<typeof run>((_context, callback) => callback())
		}),
		{virtual: true}
	);
}
