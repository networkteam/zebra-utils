export type ImgProxyMiddlewareOptions = {
  allowedWidths: number[];
};

export type StyleguideContent = {
  title: string;
  path?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  pages?: StyleguideContent[];
  variants?: StyleguideVariantProps[];
};

export type StyleguideVariantProps = {
  title?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  component: React.ReactNode;
};
