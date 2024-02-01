const OG_ATTRIBUTE = "og: http://ogp.me/ns#";


export function getFixedHtmlAttrsAsString(htmlTag) {
	const htmlIndex = htmlTag.toLowerCase().indexOf("<html");
	const endHtmlIndex = htmlTag.indexOf(">", htmlIndex);
	const htmlTagContents = htmlTag.substr(htmlIndex + 5, endHtmlIndex - htmlIndex - 5).trim();

	let htmlTagAttributes = htmlTagContents.split("=") || []; // Split on = so we can locate all the attributes.
	let prefixFound = false;

	for (let i = 0; i < htmlTagAttributes.length; i++) {
		if (htmlTagAttributes[i].toLowerCase().trim() === "prefix") {
			prefixFound = true;
			if (htmlTagAttributes[i + 1].indexOf(OG_ATTRIBUTE) === -1) {
				//log.info("Before join - " + htmlTagAttributes[i+1]);
				htmlTagAttributes[i + 1] =
					htmlTagAttributes[i + 1].substr(
						0,
						htmlTagAttributes[i + 1].length - 1
					) +
					" " +
					OG_ATTRIBUTE +
					htmlTagAttributes[i + 1].substr(-1);
				//log.info("After join - " + htmlTagAttributes[i+1]);
			} else {
				//log.info("Already in the tag!");
			}
		}
	}
	// Join the new html element string
	let innerHtmlTagText = htmlTagAttributes.join("=");

	if (!prefixFound) innerHtmlTagText += ' prefix="' + OG_ATTRIBUTE + '"';

	return innerHtmlTagText;
}
