import { effect } from '@preact/signals-core';
import { defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import { dummyState } from '@rudderstack/analytics-js/dummyStateToDelete';

const dummyPlugins = [
  {
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
  },
  {
    name: 'localTest2',
    local: {
      test(data: any[]): any[] {
        const newData = [...data];
        newData.push('item from local plugin 2');

        return newData;
      },
    },
  },
  {
    name: 'localTest3',
    localMutate: {
      test(data: any[]) {
        data.push('item from local plugin 3');
      },
    },
  },
  {
    name: 'dummyMultiLifeCyclePlugin',
    init: {
      pre(configData: any, state: any) {
        console.log(`init.pre lifecycle event: ${JSON.stringify(state.config.value)}`);
        state.config.value = configData;
      },
      post(state: any) {
        console.log(`init.post lifecycle event: ${JSON.stringify(state.config.value)}`);
      },
    },
    ready: {
      post() {
        console.log(`ready.post lifecycle event`);
        defaultPluginEngine.invoke('ready.insidePlugin');
      },
      insidePlugin() {
        console.log(`ready.insidePlugin lifecycle event`);
      },
    },
  },
];

const lazyLoadRemotePlugin = () => import('remotePlugins/RemotePlugin');
const lazyLoadRemotePlugin2 = () => import('remotePlugins/RemotePlugin2');
const lazyLoadRemoteLoadIntegrations = () => import('remotePlugins/LoadIntegrations');

const dummyRemotePlugins = [
  lazyLoadRemotePlugin,
  lazyLoadRemotePlugin2,
  lazyLoadRemoteLoadIntegrations,
];

export { dummyPlugins, dummyRemotePlugins };
