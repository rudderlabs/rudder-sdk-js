const isNumber = (value: any): value is number => typeof value === 'number' && !Number.isNaN(value);

export { isNumber };
