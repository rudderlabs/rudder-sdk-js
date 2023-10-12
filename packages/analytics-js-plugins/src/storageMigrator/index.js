import { checks, encryption } from '../shared-chunks/common';
import { decrypt as decryptLegacy } from '../storageEncryptionLegacy/legacyEncryptionUtils';
import { STORAGE_MIGRATION_ERROR } from './logMessages';
import { STORAGE_MIGRATOR_PLUGIN } from './constants';
const pluginName = 'StorageMigrator';
const StorageMigrator = () => ({
  name: pluginName,
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    migrate(key, storageEngine, errorHandler, logger) {
      try {
        const storedVal = storageEngine.getItem(key);
        if (checks.isNullOrUndefined(storedVal)) {
          return null;
        }
        let decryptedVal = decryptLegacy(storedVal);
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
        errorHandler === null || errorHandler === void 0
          ? void 0
          : errorHandler.onError(err, STORAGE_MIGRATOR_PLUGIN, STORAGE_MIGRATION_ERROR(key));
        return null;
      }
    },
  },
});
export { StorageMigrator };
export default StorageMigrator;
