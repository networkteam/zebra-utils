import { slugify } from '../utils/slugify';
import { StyleguideContent } from 'src/types';

export const getPageContent = (pageProps: StyleguideContent, slug?: string | string[]): any => {
  if (!slug || slug.length === 0) {
    return pageProps;
  }

  const data = pageProps.pages?.find((page) => page.path === slug[0] || slugify(page.title) === slug[0]);

  if (!data) {
    return null;
  }

  return getPageContent(data, slug.slice(1));
};
