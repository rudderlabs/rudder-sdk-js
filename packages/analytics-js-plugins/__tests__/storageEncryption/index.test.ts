import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { StorageEncryption } from '../../src/storageEncryption';
import { resetState, state } from '../../__mocks__/state';

describe('Plugin - Storage Encryption', () => {
  const storageEncryption = StorageEncryption();
  beforeEach(() => {
    resetState();
  });

  it('should add plugin in the loaded plugin list', () => {
    storageEncryption?.initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageEncryption')).toBe(true);
  });

  it('should encrypt the data', () => {
    const encryptedData = (storageEncryption.storage as ExtensionPoint).encrypt?.('test-data');
    expect(encryptedData).toBe('RS_ENC_v3_dGVzdC1kYXRh');
  });

  it('should decrypt encrypted data', () => {
    const decryptedData = (storageEncryption.storage as ExtensionPoint).decrypt?.(
      'RS_ENC_v3_dGVzdC1kYXRh',
    );
    expect(decryptedData).toBe('test-data');
  });

  it('should return same data if it is not a supported encryption format', () => {
    const decryptedData = (storageEncryption.storage as ExtensionPoint).decrypt?.('test-data');
    expect(decryptedData).toBe('test-data');
  });
});
