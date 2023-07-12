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

  it('should add plugin in the loaded plugin list', () => {
    storageEncryption.initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageEncryption')).toBe(true);
  });

  it('should encrypt the data', () => {
    const encryptedData = storageEncryption.storage?.encrypt('test-data');
    expect(encryptedData).toBe('RS_ENC_v3_dGVzdC1kYXRh');
  });

  it('should decrypt encrypted data', () => {
    const decryptedData = storageEncryption.storage?.decrypt('RS_ENC_v3_dGVzdC1kYXRh');
    expect(decryptedData).toBe('test-data');
  });

  it('should return same data if it is not a supported encryption format', () => {
    const decryptedData = storageEncryption.storage?.decrypt('test-data');
    expect(decryptedData).toBe('test-data');
  });
});
