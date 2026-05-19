import {jest} from '@jest/globals';


async function render(html: string, _model: object): Promise<string> {
	// Strip self-closing slashes on void elements to match real Thymeleaf output.
	const normalized = html.replace(/\s*\/>/g, '>');
	return `<html><head></head><body>${normalized}</body></html>`;
}


export function mockLibThymeleaf() {
	jest.mock(
		'/lib/thymeleaf',
		() => ({
			render: jest.fn<typeof render>().mockImplementation(render)
		}),
		{virtual: true}
	);
}
