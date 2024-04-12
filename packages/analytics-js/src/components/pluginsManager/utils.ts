import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { clone } from 'ramda';

const addDefaultPlugins = (pluginsToLoadFromConfig: PluginName[], logger?: ILogger) => {
  const finalPluginsToLoadFromConfig = clone(pluginsToLoadFromConfig);

  // Enforce default cloud mode event delivery queue plugin is none exists
  if (
    !pluginsToLoadFromConfig.includes('XhrQueue') &&
    !pluginsToLoadFromConfig.includes('BeaconQueue')
  ) {
    finalPluginsToLoadFromConfig.push('XhrQueue');
    logger?.warn(
      'As no event delivery queue plugin was configured, XhrQueue plugin was added to the list of plugins to load.',
    );
  }

  return finalPluginsToLoadFromConfig;
};

const throwWarningForMissingPlugins = (
  sourceCondition: string,
  pluginsToLoadFromConfig: PluginName[],
  pluginsToConfigure: PluginName[],
  logger?: ILogger,
) => {
  if (pluginsToConfigure.some(plugin => !pluginsToLoadFromConfig.includes(plugin))) {
    logger?.warn(
      `${sourceCondition}, but at least one of '${pluginsToConfigure.join(', ')}' plugins are not configured to load. Ignore if this was intentional. Otherwise, consider adding them to the 'plugins' load API option.`,
    );
  }
};

export { addDefaultPlugins, throwWarningForMissingPlugins };
