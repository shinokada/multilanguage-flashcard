import { ANALYTICS_ID_LANGUAGE_APP } from '$env/static/private';
import type { MetaProps } from 'runes-meta-tags';
import { metaTitle, metaDescription, metaImg, removeHyphensAndCapitalize } from 'runes-meta-tags';

export const load = ({ url }) => {
	const title = metaTitle(url.pathname, __NAME__);
	const basicDesc = 'Learn basic phrases in 27 languages with Emoji flashcards.';
	const description = metaDescription(url.pathname, basicDesc);
	const image = metaImg(url.pathname, __NAME__);

	const layoutMetaTags: MetaProps = {
		title,
		description,
		keywords: 'flashcard, language, learning, multilanguage, emoji',
		twitter: {
			card: 'summary_large_image',
			site: '@shinokada',
			creator: '@shinokada',
			title,
			description,
			image,
			imageAlt: title
		},
		og: {
			type: 'website',
			title,
			description,
			url: url.href,
			image,
			imageAlt: title,
			siteName: `${removeHyphensAndCapitalize(__NAME__)}`,
			imageWidth: '1200',
			imageHeight: '630'
		}
	};
	return {
		layoutMetaTags,
		ANALYTICS_ID_LANGUAGE_APP
	};
};
