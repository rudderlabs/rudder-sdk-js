import { sortObjectArrayByProp } from '@rudderstack/analytics-js/components/utilities/sort';

describe('Common Utils - Sort', () => {
  const objArray = [{ order: 3 }, { order: 1 }, { order: 2 }];

  it('should sort Object Array by property value', () => {
    const sortedArray = sortObjectArrayByProp(objArray, 'order');

    expect(sortedArray).toStrictEqual([{ order: 1 }, { order: 2 }, { order: 3 }]);
  });

  it('should not sort Object Array by undefined property', () => {
    const sortedArray = sortObjectArrayByProp(objArray, 'dummyKey');

    expect(sortedArray).toStrictEqual([{ order: 3 }, { order: 1 }, { order: 2 }]);
  });
});
