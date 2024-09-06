# @networkteam/zebra-utils

`zebra-utils` is a collection of helper functions and utilities designed for projects using Zebra with the app router. This package is intended for internal use only.

## Installation

To install `zebra-utils`, run:

```bash
yarn add @networkteam/zebra-utils
// npm install @networkteam/zebra-utils
```

## Table of contents

- [Zebra](#zebra)
- [ImgProxy](#imgproxy)
- [Styleguide](#styleguide)
- [Utils](#utils)

## Zebra

### Revalidation

The `revalidate` function is used inside an API route to revalidate the document cache of Next.js. It compares the bearer token with a `REVALIDATE_TOKEN` environment variable.

#### Environment variables

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

#### Folder Structure

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

The next config provides a way to use a custom image loader for all (next)-images. It's possible to define custom imageSizes and deviceSizes as well, which are used to create the srcset of the responsive image. The image loader middleware restricts images with dimensions outside of these widths. It uses the default image sizes concatenated with the default device sizes used by Next.js.

### Loader

Unfortunately, it's not possible to pass a loader function directly to the next config; it has to be a file path. So, create an `imageLoade.ts` inside of the Next.js root directory (or somewhere else in the project), with the following content:

```ts
// imageLoader.ts
import { imgProxyLoader } from '@networkteam/zebra-utils';

export default imgProxyLoader('_image', ['s3://my-s3-url']);
```

The `imgProxyLoader` creates a path with the provided width and quality (through the next image), as well as the base64 encoded src. The function takes a path segment (`_image` by default) which has to match the path segment in the following middleware. The second argument is an array of allowed source URLs. If the src of the image does not start with any of the provided URLs, the original src will be returned by the imgProxyLoader.

### Middleware

Create a `middleware.ts` inside of the Next.js root directory with the following content:

```ts
// middleware.ts
import { imgProxyMiddleware } from '@networkteam/zebra-utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/_image/')) {
    return imgProxyMiddleware(request);
  }

  return NextResponse.next();
};

export const config = {
  matcher: '/_image/:path*',
};
```

The middleware catches all paths starting with `/_image`, so all paths created by the imgproxy loader. Make sure the path segment matches the provided path segment of the imgproxy loader. Besides the request, `imgProxyMiddleware` takes `ImgProxyMiddlewareOptions`, where the allowedWidths could be overwritten.

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

## Styleguide

This package contains a styleguide which is easy to set up for all components of the project. To enable the styleguide, set the following environment variable to any truthy value:

### Environment variables

```
ENABLE_STYLEGUIDE="true"
```

### Route

First, create a folder structure for the styleguide in the app directory:

```
app
│
└── styleguide
    └── [[...slug]]
        ├── content.tsx
        ├── layout.tsx
        └── page.tsx

```

Assuming all styles and fonts are imported in the project's RootLayout, we can simply import the RootLayout into the styleguide's layout:

```ts
import RootLayout from 'app/[[...slug]]/layout';
import { localizedPage } from '@networkteam/zebra-utils';

export default RootLayout;

// With multiple languages use the localizedPage helper:
// export default localizedPage(RootLayout);
```

In the page.tsx export the Styleguide route provided by this package:

```ts
import { Styleguide } from '@networkteam/zebra-utils';
import { content } from './content';

export default Styleguide(content);
```

It's possible to use a different subpath for the styleguide, but make sure to pass the path to the `Styleguide` function as the second parameter, like `Styleguide(content, '/custom-path');`. It has to match the root folder name of the styleguide.

### Content

The content.tsx contains the structure and all components for the styleguide:

```ts
import { StyleguideColors, StyleguideContent } from '@networkteam/zebra-utils';

import Logo from 'lib/components/Logo';
import Signet from 'lib/components/Signet';
import TeaserCard from 'lib/components/TeaserCard';

import tailwindConfig from 'tailwind.config';

export const content: StyleguideContent = {
  title: 'Styleguide',
  description: 'My awesome styleguide',
  pages: [
    {
      path: 'atoms',
      title: 'Atoms',
      description: 'Atoms are the smallest building blocks of a design system.',
      pages: [
        {
          title: 'Logo',
          variants: [
            {
              title: 'Default',
              component: <Logo />,
            },
            {
              title: 'Signet',
              component: <Signet />,
            },
          ],
        },
        {
          title: 'Colors',
          variants: [
            {
              component: <StyleguideColors tailwindConfig={tailwindConfig} groupShades />,
            },
          ],
        },
      ]
    },
    {
      path: 'molecules',
      title: 'Molecules',
      description:
        'Molecules are groups of atoms bonded together and are the smallest fundamental units of a compound.',
      pages: [
        {
          title: 'Teaser Card',
          variants: [
            {
              component: (
                <TeaserCard
                  image="https://placebear.com/600/600"
                  headline="This is a Teaser"
                  text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr..."
                  buttonLabel="read more"
                  href="#"
                />
              ),
            },
          ],
        },
      ]
    },
    {
      title: 'Organisms',
      description:
        'Organisms are relatively complex components composed of groups of molecules and/or atoms and/or other organisms.',
      pages: []
    }
  ]
```

This example follows the atomic design approach, but subpages could be named anything. The pages path is by default the page title (slugified), but could be explicitly set. Note that the Colors atom uses a custom function `StyleguideColors`, which extracts all colors of a passed `tailwindConfig` and displays them in a grid.

## Utils

These are some helper functions which are often used in Zebra projects.

### cn

This package provides a function named `cn`, based on the same-named function provided by `shadcn/ui`. It uses [clsx](https://github.com/lukeed/clsx) in combination with [tailwind-merge](https://github.com/gjtorikian/tailwind_merge). `tailwind-merge` merges Tailwind CSS classes to prevent style conflicts. Use it the same way as `classNames` or `clsx`:

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

With the default sizes, when setting `marginMd` to `topLarge`, the resulting class would be `md:mt-28`. The sizes can be overwritten with the second argument of the `baseClasses` helper.

### slugify

This is a simple helper to create URL safe strings, which can be used as id's.

```ts
slugify('This is a really cool article!'); // returns "this-is-a-really-cool-article"
```
