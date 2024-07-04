import Link from 'next/link';
import { cn } from '../utils/classnames';
import { slugify } from '../utils/slugify';
import { StyleguideContent } from 'src/types';

type StyleguideNavigationProps = {
  pages: StyleguideContent[];
  path: string;
};

const Navigation = ({ pages, path }: StyleguideNavigationProps) => {
  return <NavigationList pages={pages} path={path} level={0} />;
};

type StyleguideNavigationListProps = {
  pages: StyleguideContent[];
  path: string;
  level?: number;
};

const NavigationList = ({ pages, path, level = 0 }: StyleguideNavigationListProps) => {
  return (
    <ul>
      {pages.map((page: StyleguideContent) => (
        <NavigationListItem key={page.title} page={page} path={path} level={level} />
      ))}
    </ul>
  );
};

type StyleguideNavigationListItemProps = {
  page: StyleguideContent;
  path: string;
  level: number;
};

const NavigationListItem = ({ page, path, level }: StyleguideNavigationListItemProps) => {
  const pagePath = `${path}/${page.path || slugify(page.title)}`;

  return (
    <li>
      <Link
        key={page.title}
        href={pagePath}
        className={cn('sg-block sg-rounded-md sg-py-2 sg-px-4 sg-text-white sg-font-sans hover:sg-bg-neutral-800', {
          'sg-text-xl sg-font-black mt-4': level === 0,
          'sg-text-normal': level > 0,
        })}
      >
        {page.title}
      </Link>
      {page.pages && <NavigationList pages={page.pages} path={pagePath} level={level + 1} />}
    </li>
  );
};

export default Navigation;
