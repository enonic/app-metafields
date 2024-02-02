import {jest} from '@jest/globals';


export function mockLibThymeleaf() {
	jest.mock(
		'/lib/thymeleaf',
		() => ({
			// render:
		}),
		{virtual: true}
	);
}
