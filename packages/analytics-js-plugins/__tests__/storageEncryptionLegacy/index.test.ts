import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import { StorageEncryptionLegacy } from '@rudderstack/analytics-js-plugins/storageEncryptionLegacy';

describe('Plugin - Storage Encryption Legacy', () => {
  const originalState = {
    plugins: {
      loadedPlugins: signal([]),
    },
  };
  const storageEncryptionLegacy = StorageEncryptionLegacy();
  let state: any;

  beforeEach(() => {
    state = clone(originalState);
  });

  it('should add plugin in the loaded plugin list', () => {
    storageEncryptionLegacy.initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageEncryptionLegacy')).toBe(true);
  });

  it('should encrypt the data', () => {
    const srcData = '"1wefk7M3Y1D6EDX4ZpIE00LpKAE"';
    const encryptedData = storageEncryptionLegacy.storage?.encrypt(srcData);
    expect(encryptedData.startsWith('RudderEncrypt:')).toBe(true);
    expect(storageEncryptionLegacy.storage?.decrypt(encryptedData)).toBe(srcData);
  });

  it('should decrypt encrypted data', () => {
    const decryptedData = storageEncryptionLegacy.storage?.decrypt('RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/');
    expect(decryptedData).toBe('"1wefk7M3Y1D6EDX4ZpIE00LpKAE"');
  });

  it('should return same data if it is not a supported encryption format', () => {
    const decryptedData = storageEncryptionLegacy.storage?.decrypt('test-data');
    expect(decryptedData).toBe('test-data');
  });
});
