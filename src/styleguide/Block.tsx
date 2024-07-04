'use client';

import { useEffect, useState } from 'react';
import { cn } from '../utils/classnames';

type StyleguideBlockProps = {
  component: React.ReactNode;
  title?: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
};

const Block = ({ component, title, description, className, align = 'left' }: StyleguideBlockProps) => {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (fullscreen) {
      document.documentElement.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    }
  }, [fullscreen]);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setFullscreen(false);
    }
  };

  if (!component) {
    return null;
  }

  return (
    <div className="sg-relative sg-mb-16 sg-border-b-2 sg-border-neutral-200 sg-pb-16 last-of-type:sg-border-none">
      <div className="sg-relative sg-mb-2 sg-flex sg-justify-between">
        <div className="sg-font-sans">
          {title && <h2 className="sg-text-xl sg-font-bold">{title}</h2>}
          {description && <p className="sg-text-base">{description}</p>}
        </div>
        <button
          className={cn(
            'sg-flex sg-h-6 sg-w-6 sg-items-center sg-justify-center sg-rounded sg-bg-neutral-200 hover:sg-bg-[#e0e0e0] md:sg-h-8 md:sg-w-8',
            {
              'sg-z-10': !fullscreen,
              'sg-fixed sg-bottom-4 sg-right-4 sg-z-50': fullscreen,
            }
          )}
          onClick={() => setFullscreen((v) => !v)}
        >
          <svg className="sg-h-4 sg-w-4 sg-text-neutral-500 md:sg-h-3.5 md:sg-w-3.5" viewBox="0 0 448 512">
            <path
              fill="currentColor"
              d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"
            />
          </svg>
        </button>
      </div>
      <div
        className={cn(
          {
            'sg-fixed sg-inset-0 sg-z-40 sg-overflow-y-auto sg-overflow-x-hidden sg-bg-white': fullscreen,
            'sg-z-0 sg-overflow-hidden sg-rounded-md sg-border sg-border-neutral-200 sg-p-4 md:sg-p-8': !fullscreen,
            'sg-text-left': align === 'left' && !fullscreen,
            'sg-text-center': align === 'center' && !fullscreen,
            'sg-text-right': align === 'right' && !fullscreen,
          },
          className
        )}
      >
        {component}
      </div>
    </div>
  );
};

export default Block;
