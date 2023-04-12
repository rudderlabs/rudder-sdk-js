import { effect } from '@preact/signals-core';
import { dummyState } from '@rudderstack/analytics-js/dummyStateToDelete';
import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

const localTest = (): ExtensionPlugin => ({
  name: 'localTest',
  deps: ['localTest2', 'localTest3'] as any,
  local: {
    test(data: any[]): any[] {
      const newData = [...data];
      newData.push('item from local plugin');

      effect(() => {
        const nextState = {
          ...dummyState.globalLocalState.peek(),
        };
        nextState.counter += 1;
        dummyState.globalLocalState.value = nextState;
      });

      effect(() => {
        console.log('local state in local plugin: ', dummyState.globalLocalState.value);
      });

      effect(() => {
        console.log('remote state in local plugin: ', dummyState.remoteState.value);
      });

      return newData;
    },
  },
});

export { localTest };
