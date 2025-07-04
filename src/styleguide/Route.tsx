import Layout from './Layout';
import { getPageContent } from './utils';
import { StyleguideContent } from 'src/types';

import './styles.css';
import { notFound } from 'next/navigation';

type StyleguidePageProps = {
  params: Promise<{
    slug?: string | string[];
  }>;
};

const Route =
  (content: StyleguideContent, path: string = '/styleguide') =>
  async (props: StyleguidePageProps) => {
    const { slug } = await props.params;
    if (!process.env.ENABLE_STYLEGUIDE) {
      return notFound();
    }

    const _path = path.startsWith('/') ? path : `/${path}`;

    return <Layout content={content} pageContent={getPageContent(content, slug)} path={_path} />;
  };

export default Route;
