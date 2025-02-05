import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { StorageEncryptionLegacy } from '../../src/storageEncryptionLegacy';
import { resetState, state } from '../../__mocks__/state';

describe('Plugin - Storage Encryption Legacy', () => {
  const storageEncryptionLegacy = StorageEncryptionLegacy();

  beforeEach(() => {
    resetState();
  });

  it('should add plugin in the loaded plugin list', () => {
    storageEncryptionLegacy?.initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageEncryptionLegacy')).toBe(true);
  });

  it('should encrypt the data', () => {
    const srcData = '"1wefk7M3Y1D6EDX4ZpIE00LpKAE"';
    const encryptedData = (storageEncryptionLegacy.storage as ExtensionPoint).encrypt?.(
      srcData,
    ) as string;
    expect(encryptedData.startsWith('RudderEncrypt:')).toBe(true);
    expect((storageEncryptionLegacy.storage as ExtensionPoint).decrypt?.(encryptedData)).toBe(
      srcData,
    );
  });

  it('should decrypt encrypted data', () => {
    const decryptedData = (storageEncryptionLegacy.storage as ExtensionPoint).decrypt?.(
      'RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/',
    );
    expect(decryptedData).toBe('"1wefk7M3Y1D6EDX4ZpIE00LpKAE"');
  });

  it('should return same data if it is not a supported encryption format', () => {
    const decryptedData = (storageEncryptionLegacy.storage as ExtensionPoint).decrypt?.(
      'test-data',
    );
    expect(decryptedData).toBe('test-data');
  });
});
