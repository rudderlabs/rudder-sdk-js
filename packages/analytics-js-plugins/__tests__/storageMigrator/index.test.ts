import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { StorageMigrator } from '../../src/storageMigrator';

describe('Plugin - Storage Migrator', () => {
  const originalState = {
    plugins: {
      loadedPlugins: signal([]),
    },
  };
  const storageMigrator = StorageMigrator();
  let state: any;

  beforeEach(() => {
    state = clone(originalState);
  });

  let storedVal;

  const storageEngine = {
    getItem: (key: string) => storedVal,
  };

  beforeEach(() => {
    storedVal = undefined;
  });

  it('should add plugin in the loaded plugin list', () => {
    storageMigrator.initialize(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageMigrator')).toBe(true);
  });

  it('should migrate legacy encrypted data', () => {
    storedVal = 'RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/';
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe('1wefk7M3Y1D6EDX4ZpIE00LpKAE');
  });

  it('should migrate v3 encrypted data', () => {
    storedVal = 'RS_ENC_v3_InRlc3QtZGF0YSI=';
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe('test-data');
  });

  it('should return null if the stored value is undefined', () => {
    storedVal = undefined;
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the stored value is null', () => {
    storedVal = null;
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the legacy decrypted value is undefined', () => {
    storedVal = 'RudderEncrypt:U2FsdGVkX195kUN9L968e0E/eu8CtnDHWt6ALf6bm8E=';
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the legacy decrypted value is null', () => {
    storedVal = 'RudderEncrypt:U2FsdGVkX1+SMQ+LKcuk7w/nQ9DEjgU9EUmmBgb/Pfo=';
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the v3 decrypted value is undefined', () => {
    storedVal = 'RS_ENC_v3_dW5kZWZpbmVk';
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the v3 decrypted value is null', () => {
    storedVal = 'RS_ENC_v3_bnVsbA==';
    const migratedVal = storageMigrator.storage?.migrate(
      null,
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null and log error if the stored actual value is not JSON parsable', () => {
    storedVal = 'RudderEncrypt:U2FsdGVkX1+leaJ/SuyfirUYffyQelWPnCTB93FBo4Y=';
    const migratedVal = storageMigrator.storage?.migrate(
      'someKey',
      storageEngine,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new SyntaxError('Unexpected token \'h\', "hello" is not valid JSON'),
      'StorageMigratorPlugin',
      'Failed to retrieve or parse data for someKey from storage.',
    );
  });
});
