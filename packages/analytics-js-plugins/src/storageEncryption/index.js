import { encryption } from '../shared-chunks/common';
const pluginName = 'StorageEncryption';
const StorageEncryption = () => ({
  name: pluginName,
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  storage: {
    encrypt(value) {
      return encryption.encrypt(value);
    },
    decrypt(value) {
      return encryption.decrypt(value);
    },
  },
});
export { StorageEncryption };
export default StorageEncryption;
