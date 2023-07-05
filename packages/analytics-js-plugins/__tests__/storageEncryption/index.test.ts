import { signal } from '@preact/signals-core';
import { StorageEncryption } from '@rudderstack/analytics-js-plugins/storageEncryption';
import { clone } from 'ramda';

describe('Plugin - Storage Encryption', () => {
  const originalState = {
    plugins: {
      loadedPlugins: signal([]),
    },
  };
  const storageEncryption = StorageEncryption();
  let state: any;

  beforeEach(() => {
    state = clone(originalState);
  });

  it('should add Bugsnag plugin in the loaded plugin list', () => {
    storageEncryption.initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageEncryption')).toBe(true);
  });

  it('should encrypt the data with v3 encryption prefix', () => {
    const encryptedData = storageEncryption.storage?.encrypt('test-data');
    expect(encryptedData).toBe('RS_ENC_v3_dGVzdC1kYXRh');
  });

  it('should decrypt v3 encrypted data', () => {
    const decryptedData = storageEncryption.storage?.decrypt('RS_ENC_v3_dGVzdC1kYXRh');
    expect(decryptedData).toBe('test-data');
  });

  it('should decrypt v1 encrypted data', () => {
    const decryptedData = storageEncryption.storage?.decrypt(
      'RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/',
    );
    expect(decryptedData).toBe('"1wefk7M3Y1D6EDX4ZpIE00LpKAE"');
  });

  it('should return same data if it is not a supported encryption format', () => {
    const decryptedData = storageEncryption.storage?.decrypt('test-data');
    expect(decryptedData).toBe('test-data');
  });
});
