/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { checks, encryption } from '../shared-chunks/common';
import { decrypt as decryptLegacy } from '../storageEncryptionLegacy/legacyEncryptionUtils';
import { STORAGE_MIGRATION_ERROR } from './logMessages';
import { STORAGE_MIGRATOR_PLUGIN } from './constants';

const pluginName = 'StorageMigrator';

const StorageMigrator = (): ExtensionPlugin => ({
  name: pluginName,
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    migrate(
      key: string,
      storageEngine: IStorage,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): Nullable<string> {
      try {
        const storedVal = storageEngine.getItem(key);
        if (checks.isNullOrUndefined(storedVal)) {
          return null;
        }

        let decryptedVal = decryptLegacy(storedVal as string);

        // The value is not encrypted using legacy encryption
        // Try latest
        if (decryptedVal === storedVal) {
          decryptedVal = encryption.decrypt(storedVal);
        }

        if (checks.isNullOrUndefined(decryptedVal)) {
          return null;
        }

        // storejs that is used in localstorage engine already deserializes json strings but swallows errors
        return JSON.parse(decryptedVal);
      } catch (err) {
        errorHandler?.onError(err, STORAGE_MIGRATOR_PLUGIN, STORAGE_MIGRATION_ERROR(key));
        return null;
      }
    },
  },
});

export { StorageMigrator };

export default StorageMigrator;
