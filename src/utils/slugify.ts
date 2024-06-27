export const slugify = (value: string) => {
  if (!value) return '';

  const toLowerCase = value.toLowerCase();
  const replacedUnallowedChars = toLowerCase.replace(/\W/g, '-');
  const replacedMultipleDashes = replacedUnallowedChars.replace(/-{2,}/g, '-');
  const trimmed = replacedMultipleDashes.replace(/^-|-$/g, '');
  const prefixIfFirstCharIsNumber = trimmed.replace(/^(\d)/, 'id-$1');

  return prefixIfFirstCharIsNumber;
};
