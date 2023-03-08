import { effect } from '@preact/signals-core';
import { pluginEngineInstance } from '@rudderstack/analytics-js/npmPackages/js-plugin/PluginEngine';
import { globalLocalState, remoteState } from '../state/index';

// TODO: define types for plugins
// TODO: In register also pass automatically the state to all plugins
// TODO: copy the source of js-plugin so we can extend to to auto pass GlobalState
// TODO: we may want to add chained plugins that pass their value to the next one
// TODO: add retry mechanism for getting remote plugins
const initPlugins = async () => {
  pluginEngineInstance.register({
    name: 'localTest',
    deps: ['localTest2', 'localTest3'] as any,
    local: {
      test(data: any[]): any[] {
        const newData = [...data];
        newData.push('item from local plugin');

        effect(() => {
          const nextState = {
            ...globalLocalState.peek(),
          };
          nextState.counter += 1;
          globalLocalState.value = nextState;
        });

        effect(() => {
          console.log('local state in local plugin: ', globalLocalState.value);
        });

        effect(() => {
          console.log('remote state in local plugin: ', remoteState.value);
        });

        return newData;
      },
    },
  });
  pluginEngineInstance.register({
    name: 'localTest2',
    local: {
      test(data: any[]): any[] {
        const newData = [...data];
        newData.push('item from local plugin 2');

        return newData;
      },
    },
  });
  pluginEngineInstance.register({
    name: 'localTest3',
    localMutate: {
      test(data: any[]) {
        data.push('item from local plugin 3');
      },
    },
  });
  pluginEngineInstance.register({
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
        pluginEngineInstance.invoke('ready.insidePlugin');
      },
      insidePlugin() {
        console.log(`ready.insidePlugin lifecycle event`);
      },
    },
  });

  // Load and register remote plugins
  const lazyLoadRemotePlugin = () => import('remoteModules/RemotePlugin');
  const lazyLoadRemotePlugin2 = () => import('remoteModules/RemotePlugin2');
  const lazyLoadRemoteLoadIntegrations = () => import('remoteModules/LoadIntegrations');

  const remotePluginsList = [
    lazyLoadRemotePlugin,
    lazyLoadRemotePlugin2,
    lazyLoadRemoteLoadIntegrations,
  ];

  // TODO: fix await until all remote plugins have been fetched
  remotePluginsList.forEach(async remotePlugin => {
    await remotePlugin().then(remotePluginModule =>
      pluginEngineInstance.register(remotePluginModule.default()),
    );
  });
};

const registerCustomPlugins = (customPlugins?: any[]) => {
  customPlugins?.forEach(customPlugin => {
    pluginEngineInstance.register(customPlugin);
  });
};

export { initPlugins, registerCustomPlugins };
