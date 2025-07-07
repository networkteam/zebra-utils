import { Metadata, NextPage } from 'next';

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export const localizedPage = async <P extends Props>(
  AsyncComponent: Promise<NextPage<P>>,
  locale: string = 'en'
): Promise<NextPage<P>> => {
  const WrappedComponent: NextPage<P> = async (props: P) => {
    const { slug } = await props?.params;
    const modifiedProps: P = {
      ...props,
      params: {
        ...props.params,
        slug: slug ? [locale, ...slug] : [locale],
      },
    };

    const Component = await AsyncComponent;
    return <Component {...modifiedProps} />;
  };

  const Component = await AsyncComponent;
  WrappedComponent.displayName = `localizedPage(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export const localizedMetadata = (
  generateMetadata: ({ params }: Props) => Promise<Metadata>,
  locale: string = 'en'
) => {
  return async ({
    params,
  }: {
    params: Promise<{
      slug: string[];
    }>;
  }): Promise<Metadata> => {
    const { slug } = await params;
    const modifiedParams = {
      ...params,
      slug: slug ? [locale, ...slug] : [locale],
    };

    return generateMetadata({ params: modifiedParams });
  };
};
