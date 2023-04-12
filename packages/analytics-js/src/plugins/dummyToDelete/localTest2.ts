import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

const localTest2 = (): ExtensionPlugin => ({
  name: 'localTest2',
  local: {
    test(data: any[]): any[] {
      const newData = [...data];
      newData.push('item from local plugin 2');

      return newData;
    },
  },
});

export { localTest2 };
