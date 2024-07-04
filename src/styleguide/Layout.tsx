'use client';

import Link from 'next/link';
import { useState } from 'react';
import { StyleguideContent } from '../types';
import NavigationList from './Navigation';
import Block from './Block';
import { cn } from '../utils/classnames';
import Sitemap from './Sitemap';

type StyleguidePlaygroundProps = {
  content: StyleguideContent;
  pageContent: StyleguideContent;
  path: string;
};

const Layout = ({ content, pageContent, path }: StyleguidePlaygroundProps) => {
  const [openNav, setOpenNav] = useState(false);

  if (!pageContent) {
    return null;
  }

  return (
    <div className="sg-relative sg-min-h-screen">
      <header className="sg-fixed sg-top-0 sg-left-0 sg-right-0 sg-z-40 sg-h-12 sg-bg-white sg-font-sans sg-shadow-xl md:sg-hidden">
        <button
          className="sg-absolute sg-top-2 sg-right-4 sg-z-50 sg-rounded sg-bg-white sg-p-1.5 sg-text-neutral-800 hover:sg-opacity-60 md:sg-hidden"
          onClick={() => setOpenNav((v) => !v)}
        >
          <svg className="sg-h-5 sg-w-5" viewBox="0 0 448 512">
            <path
              fill="currentColor"
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
            />
          </svg>
        </button>
      </header>
      <aside
        className={cn(
          'sg-fixed sg-inset-0 sg-z-[70] sg-w-56 sg-bg-neutral-900 sg-font-sans sg-px-4 sg-pt-20 sg-pb-8 sg-overflow-y-auto md:sg-z-[10] md:sg-py-8',
          {
            'sg-hidden md:sg-block': !openNav,
          }
        )}
      >
        <div className="sg-space-y-2">
          <>
            <Link
              href={path}
              className="sg-block sg-rounded-md sg-px-4 sg-py-2 sg-font-black sg-text-2xl sg-text-white hover:bg-neutral-800"
            >
              {content.title}
            </Link>
            {content.pages && <NavigationList pages={content.pages} path={path} />}
          </>
        </div>
      </aside>
      <div className="sg-relative md:sg-pl-56">
        <div
          className={cn('sg-mx-auto sg-py-24 sg-px-4 md:sg-py-32 md:sg-px-8', {
            'sg-max-w-4xl': pageContent.size === 'sm' || !pageContent.size,
            'sg-max-w-6xl': pageContent.size === 'md',
            'sg-max-w-[100rem]': pageContent.size === 'lg',
          })}
        >
          <h1 className="sg-mb-8 sg-text-5xl sg-font-bold sg-font-sans">{pageContent.title}</h1>
          {pageContent.description && <p className="sg-mb-8 sg-text-lg sg-font-sans">{pageContent.description}</p>}
          {pageContent.pages && <Sitemap pages={pageContent.pages} />}
          {pageContent.variants && pageContent.variants.map((variant, index) => <Block key={index} {...variant} />)}
        </div>
      </div>
      {openNav && (
        <button
          className="sg-fixed sg-inset-0 sg-z-[60] sg-w-screen sg-bg-neutral-900 sg-bg-opacity-20 md:sg-hidden"
          onClick={() => setOpenNav(false)}
        ></button>
      )}
    </div>
  );
};

export default Layout;
