import resolveConfig from 'tailwindcss/resolveConfig';
import { cn } from '../utils/classnames.js';

type StyleguideColorsProps = {
  tailwindConfig: import('tailwindcss').Config;
  groupShades?: boolean;
};

const Colors = ({ tailwindConfig, groupShades }: StyleguideColorsProps) => {
  const twFullConfig = resolveConfig(tailwindConfig);

  if (!twFullConfig?.theme?.colors) {
    return <>No colors found</>;
  }

  return (
    <div
      className={cn({
        'sg-space-y-6': groupShades,
        'sg-grid sg-grid-cols-4 sg-gap-2 md:sg-grid-cols-8': !groupShades,
      })}
    >
      {Object.entries(twFullConfig.theme.colors).map(([group, shades]) => {
        if (shades === 'inherit' || shades === 'transparent' || shades === 'currentColor') return;

        return (
          <div key={group}>
            <h2 className="sg-mb-2 sg-truncate sg-text-sm sg-font-bold sg-font-sans">{group}</h2>
            <div
              className={cn({
                'sg-flex sg-flex-col sg-gap-4': !groupShades,
                'sg-grid sg-grid-cols-4 sg-gap-2 sm:sg-grid-cols-5 lg:sg-grid-cols-10': groupShades,
              })}
            >
              {typeof shades === 'string' && <Color value={shades} />}
              {typeof shades === 'object' &&
                Object.entries(shades).map(([shade, value]) => <Color key={shade} value={value} shade={shade} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Color = ({ shade, value }: { shade?: string; value: string | unknown }) => {
  return (
    <div key={shade} className="sg-flex sg-flex-col sg-items-center sg-font-sans sg-text-sm">
      <div
        className="sg-h-10 sg-w-full sg-rounded-lg sg-border sg-border-[#e5e5e5] md:h-12"
        style={{ backgroundColor: value as string }}
      />
      {shade === 'DEFAULT' ? 'default' : shade}
    </div>
  );
};

export default Colors;
