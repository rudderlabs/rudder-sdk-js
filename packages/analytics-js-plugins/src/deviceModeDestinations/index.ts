/* eslint-disable no-param-reassign */
import { ExtensionPlugin, IExternalSrcLoader, PluginName, ApplicationState } from '../types/common';

const pluginName = PluginName.DeviceModeDestinations;

const integrationSDKLoaded = (pluginName: string, modName: string) => {
  try {
    return (
      Boolean((window as any)[pluginName]) &&
      (window as any)[pluginName][modName] &&
      typeof (window as any)[pluginName][modName].prototype.constructor !== 'undefined'
    );
  } catch (e) {
    console.log(e);
    return false;
  }
};

const pause = (time: number) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

const DeviceModeDestinations = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  remote: {
    test() {
      console.log('loadIntegrationsTest');
    },
    load_integrations(
      clientIntegrations: any[],
      state: any,
      externalSrcLoader: IExternalSrcLoader,
      externalScriptOnLoad: (id?: string) => unknown,
    ) {
      console.log(
        'loadIntegrations start',
        clientIntegrations,
        state,
        externalSrcLoader,
        externalScriptOnLoad,
      );

      const isInitialized = (instance: any, time = 0) =>
        new Promise(resolve => {
          if (instance.isLoaded()) {
            console.log('instance.isLoaded');
            state.nativeDestinations.successfullyLoadedIntegration.value = [
              ...state.nativeDestinations.successfullyLoadedIntegration.value,
              instance,
            ];
            resolve(this);
          } else if (time >= 11000) {
            console.log('instance.failed');
            state.nativeDestinations.failedToBeLoadedIntegration.value = [
              ...state.nativeDestinations.failedToBeLoadedIntegration.value,
              instance,
            ];
            resolve(this);
          } else {
            pause(1000).then(() =>
              isInitialized(instance, time + 1000)
                .then(resolve)
                .catch(() => {}),
            );
          }
        });

      clientIntegrations.forEach(intg => {
        console.log(intg);
        const pluginName = `${intg.name}_RS`; // this is the name of the object loaded on the window
        const modName = intg.name;
        const modURL = `https://cdn.rudderlabs.com/v1.1/js-integrations/${modName}.min.js`;

        if (!(window as any)[pluginName]) {
          externalSrcLoader
            .loadJSFile({
              url: modURL,
              id: modName,
              callback: externalScriptOnLoad,
            })
            .catch(() => {});
        }

        const interval = setInterval(() => {
          if (integrationSDKLoaded(pluginName, modName)) {
            const intMod = (window as any)[pluginName];
            clearInterval(interval);

            let intgInstance;
            try {
              const msg = `[Analytics] processResponse :: trying to initialize integration name:: ${pluginName}`;
              console.log(msg);
              // TODO: why we pass all analytics instance here? used in browser.constructor of each integration ????
              intgInstance = new intMod[modName](intg.config, {
                loadIntegration: true,
                userId: undefined,
                anonymousId: '123456',
                logLevel: 'error',
                userTraits: undefined,
                loadOnlyIntegrations: {
                  VWO: {
                    loadIntegration: true,
                  },
                },
                groupId: undefined,
                groupTraits: undefined,
                methodToCallbackMapping: {
                  syncPixel: false,
                },
                emit: () => {},
              });
              intgInstance.init();

              isInitialized(intgInstance)
                .then(() => {
                  const initializedDestination = {} as Record<string, any>;
                  initializedDestination[pluginName] = intMod[modName];

                  state.nativeDestinations.dynamicallyLoadedIntegrations.value = {
                    ...state.nativeDestinations.dynamicallyLoadedIntegrations.value,
                    ...initializedDestination,
                  };
                })
                .catch(e => {
                  throw e;
                });
            } catch (e: any) {
              const message = `[Analytics] 'integration.init()' failed :: ${pluginName} :: ${e.message}`;
              console.error(e, message, intgInstance);
            }
          }
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
        }, 10000);
      });
    },
  },
});

export { DeviceModeDestinations };

export default DeviceModeDestinations;
