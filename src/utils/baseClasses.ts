import { NeosContentNode } from '@networkteam/zebra';
import { cn } from './classnames';

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

export const marginClasses = (node: NeosContentNode, sizes: Map<string, string>) => {
  const xs = sizes.get(node.properties.marginXs);
  const sm = sizes.get(node.properties.marginSm);
  const md = sizes.get(node.properties.marginMd);
  const lg = sizes.get(node.properties.marginLg);
  const xl = sizes.get(node.properties.marginXl);
  const xxl = sizes.get(node.properties.marginXxl);

  return cn({
    [`m${xs}`]: xs,
    [`sm:m${sm}`]: sm,
    [`md:m${md}`]: md,
    [`lg:m${lg}`]: lg,
    [`xl:m${xl}`]: xl,
    [`2xl:m${xxl}`]: xxl,
  });
};

export const paddingClasses = (node: NeosContentNode, sizes: Map<string, string>) => {
  const xs = sizes.get(node.properties.paddingXs);
  const sm = sizes.get(node.properties.paddingSm);
  const md = sizes.get(node.properties.paddingMd);
  const lg = sizes.get(node.properties.paddingLg);
  const xl = sizes.get(node.properties.paddingXl);
  const xxl = sizes.get(node.properties.paddingXxl);

  return cn({
    [`p${xs}`]: xs,
    [`sm:p${sm}`]: sm,
    [`md:p${md}`]: md,
    [`lg:p${lg}`]: lg,
    [`xl:p${xl}`]: xl,
    [`2xl:p${xxl}`]: xxl,
  });
};

export const baseClasses = (node: NeosContentNode, sizes: Map<string, string> = defaultSizes) => {
  return cn(marginClasses(node, sizes), paddingClasses(node, sizes));
};
