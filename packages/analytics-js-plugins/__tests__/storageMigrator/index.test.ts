import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import type { ExtensionPoint } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { defaultLocalStorage } from '@rudderstack/analytics-js-common/__mocks__/Storage';
import { StorageMigrator } from '../../src/storageMigrator';
import { resetState, state } from '../../__mocks__/state';

describe('Plugin - Storage Migrator', () => {
  const storageMigrator = StorageMigrator();

  beforeEach(() => {
    resetState();
  });

  it('should add plugin in the loaded plugin list', () => {
    storageMigrator?.initialize?.(state);
    expect(state.plugins.loadedPlugins.value.includes('StorageMigrator')).toBe(true);
  });

  it('should migrate legacy encrypted data', () => {
    defaultLocalStorage.setItem(
      'key',
      'RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/',
    );

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe('1wefk7M3Y1D6EDX4ZpIE00LpKAE');
  });

  it('should migrate v3 encrypted data', () => {
    defaultLocalStorage.setItem('key', 'RS_ENC_v3_InRlc3QtZGF0YSI=');

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe('test-data');
  });

  it('should return null if the stored value is undefined', () => {
    defaultLocalStorage.setItem('key', undefined);

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the stored value is null', () => {
    defaultLocalStorage.setItem('key', null);

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the legacy decrypted value is undefined', () => {
    defaultLocalStorage.setItem(
      'key',
      'RudderEncrypt:U2FsdGVkX195kUN9L968e0E/eu8CtnDHWt6ALf6bm8E=',
    );

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the legacy decrypted value is null', () => {
    defaultLocalStorage.setItem(
      'key',
      'RudderEncrypt:U2FsdGVkX1+SMQ+LKcuk7w/nQ9DEjgU9EUmmBgb/Pfo=',
    );

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      null,
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the v3 decrypted value is undefined', () => {
    defaultLocalStorage.setItem('key', 'RS_ENC_v3_dW5kZWZpbmVk');

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null if the v3 decrypted value is null', () => {
    defaultLocalStorage.setItem('key', 'RS_ENC_v3_bnVsbA==');

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      null,
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
  });

  it('should return null and log error if the stored actual value is not JSON parsable', () => {
    defaultLocalStorage.setItem(
      'key',
      'RudderEncrypt:U2FsdGVkX1+leaJ/SuyfirUYffyQelWPnCTB93FBo4Y=',
    );

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe(null);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new SyntaxError('Unexpected token \'h\', "hello" is not valid JSON'),
      'StorageMigratorPlugin',
      'Failed to retrieve or parse data for key from storage.',
    );
  });
});
