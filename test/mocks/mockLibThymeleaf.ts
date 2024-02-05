import {jest} from '@jest/globals';
// import sp from 'synchronized-promise'
import {TemplateEngine} from 'thymeleaf';


let templateEngine = new TemplateEngine();

async function render(html: string, model: object) {
	return await templateEngine.process(html, model);
}

// const syncRender = sp(render);


export function mockLibThymeleaf() {
	jest.mock(
		'/lib/thymeleaf',
		() => ({
			render: jest.fn<typeof render>().mockImplementation(render)
		}),
		{virtual: true}
	);
}
