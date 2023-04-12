import { prop, sortBy } from 'ramda';

// A helper method to sort an array according to sortProp property of the array element.
const sortObjectArrayByProp = (arr: unknown[], sortProp: string): unknown[] => {
  const sortMethod = sortBy(prop(sortProp));
  return sortMethod(arr);
};

// arr.sort((a, b) => {
//   var order1 = a.hasOwnProperty(sortProp) ? a[sortProp] : 1000000;
//   var order2 = b.hasOwnProperty(sortProp) ? b[sortProp] : 1000000;
//   return order1 - order2;
// });

export { sortObjectArrayByProp };
