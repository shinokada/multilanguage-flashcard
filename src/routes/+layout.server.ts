import { ANALYTICS_ID } from '$env/static/private';
import type { MetaProps } from 'runes-meta-tags';
import { splitAndCapitalize, removeHyphensAndCapitalize } from './utils/helpers';
export const load = ({ url }) => {
  const title = splitAndCapitalize(url.pathname) ? `${splitAndCapitalize(url.pathname)} - ${removeHyphensAndCapitalize(__NAME__)}` : `${removeHyphensAndCapitalize(__NAME__)}`;
  const baseDescription = 'Learn 27 languages with emojis on Multilanguage flashcard.'
  const description = splitAndCapitalize(url.pathname) ? `${splitAndCapitalize(url.pathname)} - ${baseDescription}.` : `${baseDescription}`;
  const image = splitAndCapitalize(url.pathname) ? `https://open-graph-vercel.vercel.app/api/svelte-5-ui-lib?title=${splitAndCapitalize(url.pathname)}` : 'https://open-graph-vercel.vercel.app/api/svelte-5-ui-lib';
  // console.log('url: ', splitAndCapitalize(url.pathname));
  const layoutMetaTags: MetaProps = {
    title,
    description,
    keywords: 'flashcard, language, learning, multilanguage, emoji',
    twitter: {
      card: 'summary_large_image',
      site: '@shinokada',
      handle: '@shinokada',
      title,
      description,
      image,
      imageAlt: title,
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
		ANALYTICS_ID
  };
};
