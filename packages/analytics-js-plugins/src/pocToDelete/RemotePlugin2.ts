import { effect } from '@preact/signals-core';
import { ApplicationState } from '@rudderstack/analytics-js/state';
import { ExtensionPlugin } from '@rudderstack/analytics-js-plugins/types/common';
import { getExposedGlobal } from '../utilities/globals';

const pluginName = 'remoteTest2';

const RemotePlugin2 = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  remote: {
    test(data: any[], cb: (data: any[]) => void) {
      console.log('state in remote plugin2', getExposedGlobal('state'));
      const state = getExposedGlobal('state');
      const newData = [...data];
      newData.push('item from remote plugin2');
      cb(newData);

      effect(() => {
        console.log('local state in remote plugin2: ', (state as any).globalLocalState.value);

        // Whenever this effect is triggered, increase `counter`.
        // But we don't want this signal to react to `remoteState` changes
        const nextState = {
          ...(state as any).remoteState.peek(),
        };
        nextState.counter += 1;
        (state as any).remoteState.value = nextState;
      });

      effect(() => {
        console.log('remote state in remote plugin2: ', (state as any).remoteState.value);
      });
    },
  },
});

export default RemotePlugin2;
