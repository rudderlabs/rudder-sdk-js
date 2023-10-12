import { decrypt, encrypt } from './legacyEncryptionUtils';
const pluginName = 'StorageEncryptionLegacy';
const StorageEncryptionLegacy = () => ({
  name: pluginName,
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value) {
      return encrypt(value);
    },
    decrypt(value) {
      return decrypt(value);
    },
  },
});
export { StorageEncryptionLegacy };
export default StorageEncryptionLegacy;
