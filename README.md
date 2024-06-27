# @networkteam/zebra-utils

`zebra-utils` is a collection of helper functions and utilities designed for projects using Zebra with the app router. This package is intended for internal use only.

## Installation

To install `zebra-utils`, run:

```bash
yarn add @networkteam/zebra-utils
// npm install @networkteam/zebra-utils
```

## Zebra

### Revalidation

The `revalidate` function is used inside an API route to revalidate the document cache of Next.js. It compares the bearer token with a `REVALIDATE_TOKEN` environment variable.

#### Environment variable

```
REVALIDATE_TOKEN=
```

#### API route

```ts
// app/api/revalidate.ts
import { revalidate } from '@networkteam/zebra-utils';

export const POST = revalidate;
```

### Internationalization

For multilanguage projects, it is necessary to create subfolders for each locale, e.g., `/en`, `/fr`. To avoid duplicated code, you can use these helpers to utilize the functions exported by page, layout and not-found inside the root-`[[...slug]]` directory, but with the locale prepended to the passed slug. By default, the prepended locale is `en`, but it can be overwritten, as shown in the example of the not-found page.

#### Example Usage

page file

```ts
// app/en/[[...slug]]/page.tsx

import { localizedMetadata, localizedPage } from '@networkteam/zebra-utils';
import Page, { generateMetadata as originalGenerateMetadata } from 'app/[[...slug]]/page';

export const generateMetadata = localizedMetadata(originalGenerateMetadata);
export default localizedPage(Page);
```

layout file

```ts
// app/en/[[...slug]]/layout.tsx

import { localizedPage } from '@networkteam/zebra-utils';
import RootLayout from 'app/[[...slug]]/layout';

export default localizedPage(RootLayout);
```

not-found file (with passed locale)

```ts
// app/fr/[[...slug]]/layout.tsx

import { localizedPage } from '@networkteam/zebra-utils';
import NotFound from 'app/[[...slug]]/not-found';

// Pass the locale to localizedPage/localizedMetadata if other than 'en'
export default localizedPage(NotFound, 'fr');
```

### Folder Structure

For the above approach to work, the folder structure needs to look like this. Note: there must be **no** other layout or not-found file in the root of the app directory:

```
app
│
└── [[...slug]]
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
└── en
│   └── [[...slug]]
│       ├── layout.tsx
│       ├── not-found.tsx
│       └── page.tsx
│
└── fr
    └── [[...slug]]
        ├── layout.tsx
        ├── not-found.tsx
        └── page.tsx
```

## ImgProxy

The next config provide a way to use a custom image loader for all (next)-images. It's possible to define custom imageSizes and deviceSizes as well, which are used to create the srcset of the responsive image. We restrict images with dimensions outside of these widths. By default the image loader middleware in this package uses the default image sizes concated with the default devices sizes.

### Environment variables

```
IMGPROXY_URL=
IMGPROXY_KEY=
IMGPROXY_SALT=
```

### Loader

Unfortunately its not possible to pass a loader function directly to the next config, it has to be a file path. So create a `imageLoader.ts` inside of the Next.js root directory (or somewhere in the project), with the following content:

```ts
// imageLoader.ts
import { imgProxyLoader } from '@networkteam/zebra-utils';

export default imgProxyLoader('_img');
```

The imgProxyLoader creates a path with the provided width and quality (through the next image), as well as the base64 encoded src. The function takes a path segment (`_img` by default) which has to match the path segment in the following middleware.

### Middleware

Create a `middleware.ts` inside of the Next.js root directory with the following content:

```ts
// middleware.ts
import { imgProxyMiddleware } from '@networkteam/zebra-utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/_img/')) {
    return imgProxyMiddleware(request);
  }

  return NextResponse.next();
};

export const config = {
  matcher: '/_img/:path*',
};
```

The middleware catches all paths starting with `/_img`, so all paths created by the imgproxy loader. If th Make sure the path segment matches the provided path segment of the imgproxy loader. Beside the request, imgProxyMiddleware takes `ImgProxyMiddlewareOptions`, where the allowedWiths could be overwritten.

### Next config

The last part is to add the image loader to the next.config.js:

```ts
// next.config.js
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
    loader: 'custom',
    loaderFile: './imageLoader.ts',
    // deviceSizes,
    // imageSizes,
  },
};
```

Its possible to define custom imageSizes/devicesSizes. Make sure to pass all sizes to the imgProxyMiddleware as well.

## ImgProxy

The next config provides a way to use a custom image loader for all (next)-images. It's possible to define custom imageSizes and deviceSizes as well, which are used to create the srcset of the responsive image. The image loader middleware restricts images with dimensions outside of these widths. It uses the default image sizes concatenated with the default device sizes used by Next.js.

### Loader

Unfortunately, it's not possible to pass a loader function directly to the next config; it has to be a file path. So, create an `imageLoade.ts` inside of the Next.js root directory (or somewhere else in the project), with the following content:

```ts
// imageLoader.ts
import { imgProxyLoader } from '@networkteam/zebra-utils';

export default imgProxyLoader('_img');
```

The `imgProxyLoader` creates a path with the provided width and quality (through the next image), as well as the base64 encoded src. The function takes a path segment (`_img` by default) which has to match the path segment in the following middleware.

### Middleware

Create a `middleware.ts` inside of the Next.js root directory with the following content:

```ts
// middleware.ts
import { imgProxyMiddleware } from '@networkteam/zebra-utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/_img/')) {
    return imgProxyMiddleware(request);
  }

  return NextResponse.next();
};

export const config = {
  matcher: '/_img/:path*',
};
```

The middleware catches all paths starting with `/_img`, so all paths created by the imgproxy loader. Make sure the path segment matches the provided path segment of the imgproxy loader. Besides the request, `imgProxyMiddleware` takes `ImgProxyMiddlewareOptions`, where the allowedWidths could be overwritten.

### Next config

The last part is to add the image loader to the `next.config.js`:

```ts
// next.config.js
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
    loader: 'custom',
    loaderFile: './imageLoader.ts',
    // deviceSizes,
    // imageSizes,
  },
};
```

It's possible to define custom imageSizes/deviceSizes. Make sure to pass all sizes to the imgProxyMiddleware as well.

## Utils

These are some helper functions which are often used in Zebra projects.

### cn

This package provides a function named _cn_, based on the same-named function provided by _shadcn/ui_. It uses [clsx](https://github.com/lukeed/clsx) in combination with [tailwind-merge](https://github.com/gjtorikian/tailwind_merge). _tailwind-merge_ merges Tailwind CSS classes to prevent style conflicts. Use it the same way as _classNames_ or _clsx_:

```ts

<div
    className={cn('p-4 rounded-lg',
        {
            'bg-red-500': color === 'red',
            'bg-blue-500': color === 'blue',
        },
        className
    )}
>
    {children}
</div>
```

### baseClasses

This function maps spacing properties of a provided node to Tailwind CSS classes. It takes a `NeosContentNode` and optionally a sizes map and returns a string containing Tailwind CSS classes for padding and margin, if appropriate properties are set inside the node.

#### Usage

```ts
<div className={baseClasses(node)}></div>
```

The margin property names are `marginXs`, `marginSm`, `marginMd`, `marginLg`, `marginXl`, and `marginXxl`. For padding, it's the same, but with `padding` as the prefix.

The sizes map is used to match property values to a Tailwind CSS spacing class, or at least the last part of it.

#### defaultSizes

```ts
const defaultSizes = new Map([
  ['topExtraSmall', 't-12'],
  ['topSmall', 't-20'],
  ['topBase', 't-24'],
  ['topLarge', 't-28'],
  ['topExtraLarge', 't-36'],
  ['extraSmall', 'y-12'],
  ['small', 'y-20'],
  ['base', 'y-24'],
  ['large', 'y-28'],
  ['extraLarge', 'y-36'],
  ['bottomExtraSmall', 'b-12'],
  ['bottomSmall', 'b-20'],
  ['bottomBase', 'b-24'],
  ['bottomLarge', 'b-28'],
  ['bottomExtraLarge', 'b-36'],
]);
```

For example, with the default sizes, when setting `marginMd` to `topLarge`, the resulting class would be `md:mt-28`. The sizes can be overwritten with the second argument of the `baseClasses` helper.

### slugify

This is a simple helper to create URL safe strings, which can be used as id's.

```ts
slugify('This is a really cool article!'); // returns "this-is-a-really-cool-article"
```
