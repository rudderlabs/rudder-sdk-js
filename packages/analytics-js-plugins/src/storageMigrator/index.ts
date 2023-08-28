/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { decrypt as decryptLegacy } from '@rudderstack/analytics-js-plugins/storageEncryptionLegacy/legacyEncryptionUtils';
import { decrypt } from '@rudderstack/analytics-js-plugins/storageEncryption/encryptionUtils';
import { STORAGE_MIGRATION_ERROR } from '@rudderstack/analytics-js-plugins/utilities/logMessages';
import { STORAGE_MIGRATOR_PLUGIN } from '@rudderstack/analytics-js-plugins/storageMigrator/constants';

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
        if (isNullOrUndefined(storedVal)) {
          return null;
        }

        let decryptedVal = decryptLegacy(storedVal as string);

        // The value is not encrypted using legacy encryption
        // Try latest
        if (decryptedVal === storedVal) {
          decryptedVal = decrypt(storedVal);
        }

        if (isNullOrUndefined(decryptedVal)) {
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
