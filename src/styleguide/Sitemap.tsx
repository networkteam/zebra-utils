'use client';

import Link from 'next/link';
import { cn } from '../utils/classnames';
import { slugify } from '../utils/slugify';
import { StyleguideContent } from 'src/types';
import { usePathname } from 'next/navigation';

type StyleguideSitemapProps = {
  pages: StyleguideContent[];
};

const Sitemap = ({ pages }: StyleguideSitemapProps) => {
  const pathname = usePathname();

  return <SitemapList pages={pages} pathname={pathname} level={0} />;
};

type StyleguideSitemapListProps = {
  pages: StyleguideContent[];
  pathname: string;
  level?: number;
};

const SitemapList = ({ pages, pathname, level = 0 }: StyleguideSitemapListProps) => {
  return (
    <ul className="sg-list-disc sg-pl-4 sg-mb-4">
      {pages.map((page: StyleguideContent) => (
        <SitemapItem key={page.title} page={page} pathname={pathname} level={level} />
      ))}
    </ul>
  );
};

type StyleguideSitemapItemProps = {
  page: StyleguideContent;
  pathname: string;
  level: number;
};

const SitemapItem = ({ page, pathname, level }: StyleguideSitemapItemProps) => {
  const pagePath = `${pathname}/${page.path || slugify(page.title)}`;

  return (
    <li>
      <Link
        key={page.title}
        href={pagePath}
        className={cn('sg-neutral-900 sg-font-sans hover:sg-underline', {
          'sg-text-xl sg-font-semibold mt-4': level === 0,
          'sg-text-normal': level > 0,
        })}
      >
        {page.title}
      </Link>
      {page.pages && <SitemapList pages={page.pages} pathname={pagePath} level={level + 1} />}
    </li>
  );
};

export default Sitemap;
