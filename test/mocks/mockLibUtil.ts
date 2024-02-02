import {jest} from '@jest/globals';


export function mockLibUtil() {
	jest.mock(
		'/lib/util',
		() => ({
			app: {
				getJsonName: () => 'com-enonic-app-metafields',
			}
		}),
		{virtual: true}
	);
}
