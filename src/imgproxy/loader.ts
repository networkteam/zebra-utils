import { urlSafeBase64 } from './utils';
import { ImageLoaderProps } from 'next/image';

const imgProxyLoader =
  (pathSegment: string = '_image') =>
  ({ src, width, quality }: ImageLoaderProps) => {
    // If the source is not an S3 URL, return the original source
    if (!src.startsWith('s3://')) return src;

    const encodedUrl = urlSafeBase64(src);
    const params = new URLSearchParams();

    params.append('width', width.toString());

    return `/${pathSegment}/${encodedUrl}?${params.toString()}`;
  };

export default imgProxyLoader;
