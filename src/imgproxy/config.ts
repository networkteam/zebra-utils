import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import { ImgProxyMiddlewareOptions } from 'src/types';

export const allowedWidths = imageConfigDefault.imageSizes.concat(imageConfigDefault.deviceSizes);

export const defaultOptions: ImgProxyMiddlewareOptions = {
  allowedWidths,
};
