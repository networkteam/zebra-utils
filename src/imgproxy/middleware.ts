import { NextRequest, NextResponse } from 'next/server';
import { sign } from './utils';
import { defaultOptions } from './config';
import { ImgProxyMiddlewareOptions } from 'src/types';

const IMGPROXY_URL = process.env.IMGPROXY_URL;
const IMGPROXY_KEY = process.env.IMGPROXY_KEY;
const IMGPROXY_SALT = process.env.IMGPROXY_SALT;

const imgProxyMiddleware = async (request: NextRequest, options?: ImgProxyMiddlewareOptions) => {
  if (!IMGPROXY_URL || !IMGPROXY_KEY || !IMGPROXY_SALT) {
    return NextResponse.json({ error: 'Image Proxy is not configured' }, { status: 500 });
  }

  const { allowedWidths } = { ...defaultOptions, ...options };
  const src = request.nextUrl.pathname.split('/')[2];
  const width = request.nextUrl.searchParams.get('width');

  if (!src || !width) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const _width = parseInt(width as string, 10);

  if (!allowedWidths.includes(_width)) {
    return NextResponse.json({ error: 'Invalid width' }, { status: 400 });
  }

  const _src = Array.isArray(src) ? src.join('/') : src;
  const path = `/g:sm/rs:fill:${_width}/${_src}`;
  const signature = await sign(IMGPROXY_SALT, path, IMGPROXY_KEY);
  const target = `${IMGPROXY_URL}/${signature}${path}`;

  return NextResponse.rewrite(target);
};

export default imgProxyMiddleware;
