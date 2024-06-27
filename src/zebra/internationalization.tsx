import { NextPage, Metadata } from 'next';

type Props = {
  params: {
    slug: string[];
  };
};

export const localizedPage = <P extends Props>(Component: NextPage<P>, locale: string = 'en'): NextPage<P> => {
  const WrappedComponent: NextPage<P> = (props: P) => {
    const modifiedProps: P = {
      ...props,
      params: {
        ...props.params,
        slug: props?.params?.slug ? [locale, ...props?.params?.slug] : [locale],
      },
    };

    return <Component {...modifiedProps} />;
  };

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
    params: {
      slug: string[];
    };
  }): Promise<Metadata> => {
    const modifiedParams = {
      ...params,
      slug: params?.slug ? [locale, ...params.slug] : [locale],
    };

    return generateMetadata({ params: modifiedParams });
  };
};
