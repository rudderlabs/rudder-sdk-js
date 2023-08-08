const removeDuplicateSlashes = (str: string): string => str.replace(/\/{2,}/g, '/');

export { removeDuplicateSlashes };
