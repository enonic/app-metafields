import type {Extensions, GraphQL} from '/guillotine/guillotine.d';
import type {MetafieldsSiteConfig} from '/lib/common/MetafieldsSiteConfig.d';


import {
	get as getContentByKey,
	getSite as libsContentGetSite,
	getSiteConfig as libsContentGetSiteConfig,
} from '/lib/xp/content';
import {
	get as getContext,
	run as runInContext
} from '/lib/xp/context';
import {getBlockRobots} from '/lib/common/getBlockRobots';
import {getLang} from '/lib/common/getLang';
import {getMetaDescription} from '/lib/common/getMetaDescription';
import {getPageTitle} from '/lib/common/getPageTitle';
import {getTheConfig} from '/lib/common/getTheConfig';
import {APP_NAME_PATH, MIXIN_PATH} from '/lib/common/constants';
import {commaStringToArray} from '/lib/common/commaStringToArray';
import {findStringValueInObject} from '/lib/common/findStringValueInObject';
import {GraphQLFieldName, GraphQLTypeName} from '/guillotine/guillotine.d';


export const extensions = (graphQL: GraphQL): Extensions => {
	return {
		types: {
			[GraphQLTypeName.METAFIELDS]: {
				description: 'Meta fields for a content',
				fields: {
					alternates: {
						type: graphQL.Json,
					},
					description: {
						type: graphQL.GraphQLString,
					},
					images: {
						type: graphQL.list(graphQL.reference(GraphQLTypeName.CONTENT)),
					},
					openGraph: {
						type: graphQL.Json,
					},
					robots: {
						type: graphQL.Json,
					},
					title: {
						type: graphQL.nonNull(graphQL.GraphQLString),
					},
					twitter: {
						type: graphQL.Json,
					},
					verification: {
						type: graphQL.Json,
					},
				}
			}
		},
		creationCallbacks: {
			[GraphQLTypeName.CONTENT]: function (params) {
				params.addFields({
					[GraphQLFieldName.METAFIELDS]: {
						type: graphQL.reference(GraphQLTypeName.METAFIELDS)
					}
				});
			}
		},
		resolvers: {
			[GraphQLTypeName.CONTENT]: {
				[GraphQLFieldName.METAFIELDS]: function (env) {
					// log.info(`resolvers content metafields ${JSON.stringify(env, null, 4)}`);
					const {
						// args,
						localContext,
						source: content
					} = env;
					const {
						branch,
						project,
						// siteKey // NOTE: Can be undefined when x-guillotine-sitekey is missing
					} = localContext;
					const {_path} = content;
					const context = getContext();
					const {
						authInfo: {
							user: {
								login: userLogin,
								idProvider: userIdProvider
							},
							principals
						}
					} = context;
					// log.info(`resolvers content metafields context ${JSON.stringify(context, null, 4)}`);
					return runInContext({
						branch,
						repository: `com.enonic.cms.${project}`,
						user: {
							idProvider: userIdProvider,
							login: userLogin,
						},
						principals
					}, () => {
						const site = libsContentGetSite({ key: _path });
						const description = getMetaDescription(content, site);
						const title = getPageTitle(content, site);
						const appOrSiteConfig = getTheConfig(site);
						const isFrontpage = site._path === _path;
						const siteConfig = libsContentGetSiteConfig<MetafieldsSiteConfig>({ key: _path, applicationKey: app.name });
						const blockRobots = siteConfig.blockRobots || getBlockRobots(content)
						const images = [];
						if (siteConfig.seoImage) {
							const imageContent = getContentByKey({ key: siteConfig.seoImage });
							if (imageContent) {
								images.push(imageContent);
							} else {
								log.error(`siteConfig.seoImage for site with _path:${site._path} references a non-existing image with key:${siteConfig.seoImage}`);
							}
						} else {
							// Try to find image contentKey in content
							const userDefinedPaths = siteConfig.pathsImages || '';
							const userDefinedArray = userDefinedPaths ? commaStringToArray(userDefinedPaths) : [];
							const userDefinedValue = userDefinedPaths ? findStringValueInObject(content, userDefinedArray, siteConfig.fullPath) : null;
							if (userDefinedValue) {
								const imageContent = getContentByKey({ key: userDefinedValue });
								if (imageContent) {
									images.push(imageContent);
								} else {
									log.error(`content with _path:${_path} references a non-existing image with key:${userDefinedValue}}`);
								}
							} else {
								if (content.data.image) {
									const imageContent = getContentByKey({ key: content.data.image });
									if (imageContent) {
										images.push(imageContent);
									} else {
										log.error(`content with _path:${_path} references a non-existing image with key:${content.data.image}}`);
									}
								} else if (content.data.images) {
									const imageContent = getContentByKey({ key: content.data.images });
									if (imageContent) {
										images.push(imageContent);
									} else {
										log.error(`content with _path:${_path} references a non-existing image with key:${content.data.images}}`);
									}
								}
							}
						}
						if (siteConfig.frontpageImage) {
							const imageContent = getContentByKey({ key: siteConfig.frontpageImage });
							if (imageContent) {
								images.push(imageContent);
							} else {
								log.error(`siteConfig.frontpageImage for site with _path:${site._path} references a non-existing image with key:${siteConfig.frontpageImage}`);
							}
						}
						let canonical = null;
						if (content.x?.[APP_NAME_PATH]?.[MIXIN_PATH]?.seoContentForCanonicalUrl) {
							const canonicalContent = getContentByKey({ key: content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl });
							if (canonicalContent) {
								canonical = canonicalContent._path;
							} else {
								log.error(`content.x.${APP_NAME_PATH}.${MIXIN_PATH}.seoContentForCanonicalUrl for content with _path:${_path} references a non-existing content with key:${content.x[APP_NAME_PATH][MIXIN_PATH].seoContentForCanonicalUrl}`);
							}
						}
						return {
							alternates: {
								canonical
							},
							description,
							images,
							openGraph: {
								// description, // NOTE: Also available on toplevel
								// images: appOrSiteConfig.removeOpenGraphImage ? [] : images
								locale: getLang(content, site),
								siteName: site.displayName,
								// title, // NOTE: Also available on toplevel
								type: isFrontpage ? 'website' : 'article',
								url: appOrSiteConfig.removeOpenGraphUrl ? null : _path,
							},
							robots: {
								follow: !blockRobots,
								index: !blockRobots,
							},
							title,
							twitter: {
								// description, // NOTE: Also available on toplevel
								// images: appOrSiteConfig.removeTwitterImage ? [] : images
								// title, // NOTE: Also available on toplevel
								creator: appOrSiteConfig.twitterUsername
							},
							verification: {
								google: siteConfig.siteVerification || null
							}
						};
					});
				}
			}
		},
	}
};
