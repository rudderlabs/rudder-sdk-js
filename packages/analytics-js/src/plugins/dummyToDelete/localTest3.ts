import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

const localTest3 = (): ExtensionPlugin => ({
  name: 'localTest3',
  localMutate: {
    test(data: any[]) {
      data.push('item from local plugin 3');
    },
  },
});

export { localTest3 };
