import {DEBUG} from '/lib/app-metafields/constants';


const OG_ATTRIBUTE = "og: http://ogp.me/ns#";
const ARTICLE_NAMESPACE = "article: http://ogp.me/ns/article#";


export function getFixedHtmlAttrsAsString({
	htmlTag,
	isFrontpage,
}: {
	htmlTag: string
	isFrontpage: boolean
}) {
	const htmlIndex = htmlTag.toLowerCase().indexOf("<html");
	const endHtmlIndex = htmlTag.indexOf(">", htmlIndex);
	const htmlTagContents = htmlTag.substr(htmlIndex + 5, endHtmlIndex - htmlIndex - 5).trim();

	let htmlTagAttributes = htmlTagContents.split("=") || []; // Split on = so we can locate all the attributes.
	let prefixFound = false;

	for (let i = 0; i < htmlTagAttributes.length; i++) {
		if (htmlTagAttributes[i].toLowerCase().trim() === "prefix") {
			prefixFound = true;
			if (htmlTagAttributes[i + 1].indexOf(OG_ATTRIBUTE) === -1) {
				DEBUG && log.debug("Before join - " + htmlTagAttributes[i+1]);
				htmlTagAttributes[i + 1] =
					htmlTagAttributes[i + 1].substr(
						0,
						htmlTagAttributes[i + 1].length - 1
					) +
					" " +
					OG_ATTRIBUTE +
					`${isFrontpage ? '' : ` ${ARTICLE_NAMESPACE}`}` +
					htmlTagAttributes[i + 1].substr(-1);
					DEBUG && log.debug("After join - " + htmlTagAttributes[i+1]);
			} else {
				DEBUG && log.debug("Already in the tag!");
			}
		}
	}
	// Join the new html element string
	let innerHtmlTagText = htmlTagAttributes.join("=");

	if (!prefixFound) {
		innerHtmlTagText += ' prefix="' + OG_ATTRIBUTE + `${isFrontpage ? '' : ` ${ARTICLE_NAMESPACE}`}` + '"';
	}

	return innerHtmlTagText;
}
