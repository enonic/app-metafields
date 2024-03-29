import type {Site} from '/lib/xp/content';
import type {MetafieldsSiteConfig} from '/lib/app-metafields/types';


import {mockContent} from './mockContent';


export const mockSite = ({
	description,
	prefix,
	siteConfig
}: {
	description: string
	prefix: string
	siteConfig: MetafieldsSiteConfig
}) => mockContent({
	data: {
		description,
		siteConfig: {
			applicationKey: 'app.name',
			config: siteConfig
		}
	},
	prefix,
	type: 'portal:site'
}) as Site<MetafieldsSiteConfig>;
