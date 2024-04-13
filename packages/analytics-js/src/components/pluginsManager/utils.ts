import { PLUGINS_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { MISCONFIGURED_PLUGINS_WARNING } from '@rudderstack/analytics-js/constants/logMessages';

const getPluginsOutputString = (plugins: PluginName[]) =>
  plugins.length === 1
    ? ` '${plugins[0]}' plugin was`
    : ` ['${plugins.join("', '")}'] plugins were`;

const getMissingPlugins = (
  configurationState: string,
  pluginsToLoadFromConfig: PluginName[],
  pluginsToConfigure: PluginName[],
  shouldWarn: boolean,
  logger?: ILogger,
): PluginName[] => {
  const missingPlugins = pluginsToConfigure.filter(
    pluginName => !pluginsToLoadFromConfig.includes(pluginName),
  );

  if (missingPlugins.length > 0 && shouldWarn) {
    logger?.warn(
      MISCONFIGURED_PLUGINS_WARNING(
        PLUGINS_MANAGER,
        configurationState,
        getPluginsOutputString(missingPlugins),
      ),
    );
  }

  return missingPlugins;
};

export { getMissingPlugins };
