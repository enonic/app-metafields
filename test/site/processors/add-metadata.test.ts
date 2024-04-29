import type { Log } from '@enonic/mock-xp';
import type {
	getContent as libPortalGetContent,
	getSite as libPortalGetSite,
	getSiteConfig as libPortalGetSiteConfig
} from '@enonic-types/lib-portal';
import type {
	Request,
	Response
} from '/lib/app-metafields/types';


import {
	// LibContent,
	// LibContext,
	// LibNode,
	// LibPortal,
	// App,
	// Request as MockRequest,
	Server
} from '@enonic/mock-xp';
import {
	describe,
	expect,
	jest,
	test as it,
} from '@jest/globals';


const server = new Server({
	loglevel: 'info'
});

// Avoid type errors below.
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log as Log;

// const app = new App({ key: 'com.enonic.app.metafields' });
// const libContent = new LibContent({ server });
// const libContext = new LibContext({ server });
// const libNode = new LibNode({ server });
// const libPortal = new LibPortal({ app, server });

jest.mock('/lib/xp/content', () => {
    return {
    }
}, { virtual: true });

jest.mock('/lib/xp/context', () => {
    return {
    }
}, { virtual: true });

jest.mock('/lib/xp/node', () => {
    return {
    }
}, { virtual: true });

jest.mock('/lib/xp/portal', () => {
	return {
		// assetUrl: jest.fn<typeof assetUrlType>((params) => libPortal.assetUrl(params)),
		// getContent: jest.fn<typeof libPortalGetContent>(() => libPortal.getContent()),
		getContent: jest.fn<typeof libPortalGetContent>(() => null),
		// getSite: jest.fn<typeof libPortalGetSite>(() => libPortal.getSite()),
		getSite: jest.fn<typeof libPortalGetSite>(() => null),
		getSiteConfig: jest.fn<typeof libPortalGetSiteConfig<{}>>(() => ({
			"canonical": true,
			"blockRobots": false,
			"twitterUsername": "@enonicHQ",
			"seoImage": "f7efd6e4-9eed-45d2-83b6-d088a7bdc685",
			"titleBehaviour": true,
			"titleSeparator": "-",
			"titleFrontpageBehaviour": true,
			"disableAppConfig": false,
			"seoImageIsPrescaled": false,
			"frontpageImage": "f7efd6e4-9eed-45d2-83b6-d088a7bdc685",
			"frontpageImageIsPrescaled": false,
			"removeTwitterImage": false,
			"removeOpenGraphUrl": false,
			"removeOpenGraphImage": false,
			"fullPath": false,
			"headless": false
		})),
		// imageUrl: jest.fn<typeof imageUrlType>((params) => libPortal.imageUrl(params)),
	}
}, { virtual: true });

jest.mock('/lib/thymeleaf', () => {
	render: jest.fn((view, model) => model)
}, { virtual: true });

describe('add-metadata', () => {
	it('should not throw when there is no content', () => {
		import('/site/processors/add-metadata').then(({responseProcessor}) => {
			const request: Request = {
				"branch": "draft",
				"method": "GET",
				"scheme": "http",
				"host": "localhost",
				"port": 8080,
				"path": "/admin/site/inline/dev-portal/draft/developer/search",
				// "rawPath": "/admin/site/inline/dev-portal/draft/developer/search",
				"url": "http://localhost:8080/admin/site/inline/dev-portal/draft/developer/search?q=test",
				// "remoteAddress": "127.0.0.1",
				"mode": "inline",
				// "webSocket": false,
				// "repositoryId": "com.enonic.cms.dev-portal",
				// "contextPath": "/admin/site/inline/dev-portal/draft/developer",
				// "params": {
				// 	"q": "test"
				// },
			}
			// libPortal.request = new MockRequest(request);
			const response: Response = {
				"status": 200,
				"contentType": "text/html; charset=utf-8",
				"postProcess": true,
				"headers": {},
				"pageContributions": {
					"headEnd": [
						"<script async src=\"/admin/site/inline/dev-portal/draft/_/asset/com.enonic.site.developer:1714396560884/js/main.min.js\"></script>"
					]
				},
				"applyFilters": true,
				"body": `<!DOCTYPE html><html lang="en"><head><title>Whatnot</title></head></html>`
			};
			const expected = {
				...response,
				body: `<!DOCTYPE html><html lang="en" prefix="og: http://ogp.me/ns# article: http://ogp.me/ns/article#"><head></head></html>`,
			};
			const actual = responseProcessor(request, response);
			expect(actual).toStrictEqual(expected);
		});
	});
});
