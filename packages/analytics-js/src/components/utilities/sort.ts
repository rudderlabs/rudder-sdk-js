import { prop, sortBy } from 'ramda';

// A helper method to sort an array according to sortProp property of the array element.
const sortObjectArrayByProp = (arr: any[], sortProp: string): any[] => {
  const sortMethod = sortBy(prop(sortProp));
  return sortMethod(arr);
};

export { sortObjectArrayByProp };
