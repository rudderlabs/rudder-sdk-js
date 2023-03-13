const isFunction = (value: any): boolean =>
  typeof value === 'function' && Boolean(value.constructor && value.call && value.apply);

export { isFunction };
