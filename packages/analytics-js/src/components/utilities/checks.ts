const isFunction = (value: any): boolean =>
  typeof value === 'function' && !!(value.constructor && value.call && value.apply);

export { isFunction };
