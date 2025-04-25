/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStorage } from '@rudderstack/analytics-js-common/types/Store';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { decrypt, isNullOrUndefined } from '../shared-chunks/common';
import { decrypt as decryptLegacy } from '../storageEncryptionLegacy/legacyEncryptionUtils';
import { STORAGE_MIGRATION_ERROR } from './logMessages';
import { STORAGE_MIGRATOR_PLUGIN } from './constants';
import { isString } from '@rudderstack/analytics-js-common/utilities/checks';

const pluginName: PluginName = 'StorageMigrator';

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
    ): Nullable<any> {
      try {
        const storedVal = storageEngine.getItem(key);
        if (isNullOrUndefined(storedVal)) {
          return null;
        }

        let currentVal: any = storedVal;
        let decryptedVal = decryptLegacy(currentVal as string);

        // Decrypt using the latest encryption method as well
        decryptedVal = decrypt(decryptedVal) as string;

        // storejs that is used in localstorage engine already deserializes json strings but swallows errors
        currentVal = JSON.parse(decryptedVal);

        // Recursively decrypt the value until we reach a point where the value
        // is not encrypted anymore
        while (isString(currentVal)) {
          decryptedVal = decryptLegacy(currentVal);

          // Decrypt using the latest encryption method as well
          decryptedVal = decrypt(decryptedVal) as string;

          // If the decrypted value is the same as the current value,
          // then it's not encrypted anymore
          if (decryptedVal === currentVal) {
            break;
          }

          // storejs that is used in localstorage engine already deserializes json strings but swallows errors
          currentVal = JSON.parse(decryptedVal);
        }

        return currentVal;
      } catch (err) {
        errorHandler?.onError(err, STORAGE_MIGRATOR_PLUGIN, STORAGE_MIGRATION_ERROR(key));
        return null;
      }
    },
  },
});

export { StorageMigrator };

export default StorageMigrator;
