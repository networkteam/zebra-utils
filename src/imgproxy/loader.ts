import { urlSafeBase64 } from './utils';
import { ImageLoaderProps } from 'next/image';

const imgProxyLoader =
  (pathSegment: string = '_image', whitelistedSourceUrls: string[]) =>
  ({ src, width, quality }: ImageLoaderProps) => {
    // if the source url is not whitelisted, return the original src
    if (!whitelistedSourceUrls.some((url) => src.startsWith(url))) {
      return src;
    }

    const encodedUrl = urlSafeBase64(src);
    const params = new URLSearchParams();

    params.append('width', width.toString());

    return `/${pathSegment}/${encodedUrl}?${params.toString()}`;
  };

export default imgProxyLoader;
