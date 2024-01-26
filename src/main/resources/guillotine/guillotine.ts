import {
	getFixedHtmlAttrsAsString,
	getMetaData,
	getReusableData,
} from '/lib/metadata';

const TYPE_CONTENT = 'Content';
const TYPE_METAFIELDS = 'MetaFields';
const TYPE_METADATA = `${TYPE_METAFIELDS}_MetaData`;

const ENUM_METADATA_TYPE = `${TYPE_METADATA}_Type`;

const FIELD_METAFIELDS = 'metaFields';
const FIELD_METADATA = 'metadata';
const FIELD_HTMLTAGATTRIBUTES = 'htmlTagAttributes';


function getHtmlTagAttributes(attrString) {
    function clean(str) {
      return str.replaceAll('"', "").trim();
    }

    let arr = [];
    let attrsObj = {};

    const splittedString = attrString.split("=");

    for (let i = 0; i < splittedString.length; i += 1) {
        if (i % 2 === 0) {
            arr.push(splittedString[i]); // attribute
        } else {
            const regex = new RegExp(splittedString[i].indexOf('"') >= 0 ? '" ' : " ");
            arr = arr.concat(splittedString[i].split(regex)); // attribute + value
        }
    }

    if (arr.length % 2 !== 0) {
        return {}
    }

    for (let i = 0; i < arr.length; i += 2) {
        const key = clean(arr[i]);
        const value = clean(arr[i+1]);
        attrsObj[key] = value;
    }

    return attrsObj;
}

function getData(contentPath, htmlTag="<html>") {
    const reusableData = getReusableData(contentPath);
    // log.info(`Reusable data: ${JSON.stringify(reusableData, null, 4)}`);
    const site = reusableData.site;
    const content = reusableData.content;
    const siteConfig = reusableData.siteConfig;

    return {
        metadata: getMetaData(site, siteConfig, content, "json"),
        htmlTagAttributes: getHtmlTagAttributes(getFixedHtmlAttrsAsString(htmlTag))
    };
}


export const extensions = (graphQL) => {
    return {
        inputTypes: {
            // input type definitions ...
        },
        enums: {
            [ENUM_METADATA_TYPE]: {
                description: 'Meta data type',
                values: {
                    website: 'website',
                    article: 'article',
                },
            },
        },
        interfaces: {
            // interfaces type definitions ...
        },
        unions: {
            // unions type definitions ...
        },
        types: {
            [TYPE_METADATA]: {
                description: 'Meta data for a content',
                fields: {
                    title: {
                        type: graphQL.nonNull(graphQL.GraphQLString),
                    },
                    description: {
                        type: graphQL.GraphQLString,
                    },
                    siteName: {
                        type: graphQL.nonNull(graphQL.GraphQLString),
                    },
                    locale: {
                        type: graphQL.GraphQLString,
                    },
                    type: {
                        type: graphQL.GraphQLString,
                    },
                    url: {
                        type: graphQL.GraphQLString,
                    },
                    canonicalUrl: {
                        type: graphQL.GraphQLString,
                    },
                    imageUrl: {
                        type: graphQL.GraphQLString,
                    },
                    imageWidth: {
                        type: graphQL.GraphQLInt,
                    },
                    imageHeight: {
                        type: graphQL.GraphQLInt,
                    },
                    blockRobots: {
                        type: graphQL.GraphQLBoolean,
                    },
                    siteVerification: {
                        type: graphQL.GraphQLString,
                    },
                    canonical: {
                        type: graphQL.GraphQLBoolean,
                    },
                    twitterUserName: {
                        type: graphQL.GraphQLString,
                    },
                    twitterImageUrl: {
                        type: graphQL.GraphQLString,
                    },
                }
            },
            [TYPE_METAFIELDS]: {
                description: 'Meta fields for a content',
                fields: {
                    [FIELD_METADATA]: {
                        type: graphQL.reference(TYPE_METADATA),
                    },
                    [FIELD_HTMLTAGATTRIBUTES]: {
                        type: graphQL.GraphQLString,
                    },
                }
            }
        },
        creationCallbacks: {
            [TYPE_CONTENT]: function (params) {
                params.addFields({
                    [FIELD_METAFIELDS]: {
                        type: graphQL.reference(TYPE_METAFIELDS)
                    }
                });
            }
        },
        resolvers: {
            [TYPE_CONTENT]: {
                [FIELD_METAFIELDS]: function (env) {
                    // log.info(`resolvers content metafields ${JSON.stringify(env, null, 4)}`);
                    const {args, localContext, source} = env;
                    // const {branch,project} = localContext;
                    const {_id,_path} = source;
                    // log.info(`resolvers content metafields _id:${_id} _path:${_path}`);
                    return getData(_path);
                    // return {
                    //     [FIELD_METADATA]: {
                    //         title: 'title',
                    //         description: 'description',
                    //         siteName: 'siteName',
                    //         locale: 'locale',
                    //         type: 'website',
                    //         url: 'url',
                    //         canonicalUrl: 'canonicalUrl',
                    //         imageUrl: 'imageUrl',
                    //         imageWidth: 1,
                    //         imageHeight: 2,
                    //         blockRobots: true,
                    //         siteVerification: 'siteVerification',
                    //         canonical: true,
                    //         twitterUserName: 'twitterUserName',
                    //         twitterImageUrl: 'twitterImageUrl',
                    //     },
                    //     [FIELD_HTMLTAGATTRIBUTES]: 'htmlTagAttributes',
                    // };
                }
            }
        },
        typeResolvers: {
            // type resolver definitions ...
        }
    }
};
