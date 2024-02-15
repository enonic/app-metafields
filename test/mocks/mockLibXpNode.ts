import type {
	// GetNodeParams,
	RepoConnection,
	connect,
} from '/lib/xp/node';


import {jest} from '@jest/globals';


export function mockLibXpNode({
	nodes = {}
}: {
	nodes?: Record<string, Record<string, unknown>>
} = {}) {
	jest.mock(
		'/lib/xp/node',
		() => ({
			connect: jest.fn<typeof connect>().mockReturnValue({
				// get: jest.fn<RepoConnection['get']>().mockImplementation((...keys: (string | GetNodeParams | (string | GetNodeParams)[])[]) => nodes[keys[0]])
				get: jest.fn().mockImplementation((key: string) => {
					const node = nodes[key]
					if (!node) {
						console.info(`No node found for key: ${key}`);
					}
					return node;
				}),
				query: jest.fn().mockReturnValue({
					count: 0,
					hits: [],
					total: 0,
				})
			} as unknown as RepoConnection),
		}),
		{virtual: true}
	);
}
