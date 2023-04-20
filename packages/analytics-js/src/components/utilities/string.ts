// TODO: see if bundle size is bumped up if we use ramda trim instead of custom
const trim = (value: string): string => value.replace(/^\s+|\s+$/gm, '');

const removeDoubleSpaces = (value: string): string => value.replace(/ {2,}/g, ' ');

export { trim, removeDoubleSpaces };
