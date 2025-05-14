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

  it('should return null if the legacy decrypted value is not JSON parsable string', () => {
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

  it('should return null if the v3 decrypted value is not a JSON parsable string', () => {
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
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
      error: new SyntaxError('Unexpected token \'h\', "hello" is not valid JSON'),
      context: 'StorageMigratorPlugin',
      customMessage: 'Failed to retrieve or parse data for "key" from storage.',
      groupingHash: 'Failed to retrieve or parse data for "key" from storage.',
    });
  });

  it('should recursively decrypt the value until it is not encrypted', () => {
    // The cookie value is encrypted over and over multiple times
    // using the v3 encryption method
    defaultLocalStorage.setItem(
      'key',
      'RS_ENC_v3_IlJTX0VOQ192M19JbEpUWDBWT1ExOTJNMTlKYkVwVVdEQldUMUV4T1RKTk1UbEtZa1Z3VlZkRVFsZFVNVVY0VDFSS1RrMVViRXRaYTFaM1ZsWmtSVkZzWkZWTlZWWTBWREZTUzFSck1WVmlSWFJhWVRGYU0xWnNXbXRTVmtaeldrWldUbFpXV1RCV1JFWlRVekZTY2sxV1ZtbFNXRkpoV1ZSR1lVMHhXbk5YYlhSVFZtdGFlbGRyV2xkVWJGcFhWMVJDVjFKRldsUlZla1pUWTJzeFYxWnRiRk5YUmtwb1YxWlNSMWxWTUhoWGJrNVlZbGhTVkZadGRHRmxiR1J5VjJ4a1ZXSkdjRmhXTVZKRFZqRktSbGRzVWxabGExcFVXVEp6ZUZZeFduUmlSazVZVW10d2IxWXhXbE5TTVd4V1RVaG9XR0pyTlZsWmJHaFRWa1phZEdSSFJteGlSMUo1VmpKNGExWlhTa2RqUm1oWFRWWktSRlpxUmt0U2JHUnpWV3hhYkdFeGNGVlhWRXA2WlVaWmVGZHVVbWxTYXpWWlZXMTBkMkl4V1hoWGJFNVRUVmQ0VjFSVmFHOVhSMHB5VGxac1dtSkhhRlJXYTFwaFpFZFNTRkp0ZUdsU01VbzFWbXBLTkdFeFdsaFRhMlJxVW0xb1dGUldXa3RTUmxweFVtdDBVMkpIVW5wV1YzaGhZa2RGZUdOR1ZsaFdSWEEyV2xWYVdtVkdaSFZWYld4VFlYcFdXbFpYTVRCa01rbDRWMWhvV0dKRk5WUlVWbVEwVmpGU1ZtRkhPVmhTTUhCNVZHeGFjMWR0U2toaFJsSlhZVEZ3YUZwRlpGTlRSa3AwWlVkc1UwMVZiekZXYlhCTFRrZEZlRmRzYUZSaE1sSnhWVzB4YjFkR1VsZFhhM1JUVW14d2VGVnRkREJWTWtwSVZXNXdWMVl6YUdoWmEyUkdaVWRPUjFac2FGZFNXRUV5VjJ4V1lWZHRWa2RhU0ZaV1lsZDRWRmxZY0ZkWGJGcFlUVlJDYTAxcmJEUldNalZUVkd4a1NGVnNXbFZXYkhCWVZHdGFXbVZIUmtoUFZtUnBWbGhDU1ZkVVFtRmpNV1IwVWxob1YxZEhhRmhVVmxwM1lVWnJlRmRyWkZkV2EzQjZWa2R6TVZkR1NsWmpSV3hYWVd0dmQxbFhjekZXTVdSellVWlNhRTFZUW5oV1YzaHJZakZrUjFWc2FFOVdhelZ4V1d0YWQyVkdWWGxrUkVKV1RVUkdlVlJzVm05V01WbDZZVWRvV21FeVVrZGFWV1JQVWpGYWMxcEhiRmhTVlhCS1ZqRmFVMU14VVhsVmEyUlVZbXR3YUZWdE1XOWpSbHB4VkcwNWEySkdjRWhXTWpBMVZXc3hXR1ZHYUZkTlYyaDJWMVphUzFKc1RuUlNiR1JwVjBVME1GWkhkR0ZXYlZaSVVtdG9VRll5YUhCVmJHaERWMVprVlZGdFJtbE5WbXcxVld4b2IxZEhTbGhoUm1oYVZrVmFNMWxWV25kU2JIQkhXa1pTVjJKclNrbFdNblJyWXpGVmVWTnVTbFJoTTFKWVZGWmFTMVZHY0VWU2EzQnNVbTFTTVZaWGVGTmhWa2w0VTJ4d1dGWjZRalJVYTFwclVqRldjMkZIY0ZOaVZrcDRWMWQwWVdReVZrZFdibEpyVTBkU2NGVnFRbmRTTVZsNVRsaE9XbFpzY0ZoWk1HaExWakZhUmxkcmVGZE5WbkJJV1RJeFIxSXlSa2hoUlRWWFYwVktUMVp0TUhoa01VbDRWRzVTVjJKSFVsVlpiWFIzWVVaV2RFMVhPV3BTYkZwNFZXMTBNRll4V25SVmJHeGhVbGROTVZaWGMzaFdNV1J6WVVaa1RsWXlhRFpYVjNSaFUyMVdjMVp1VGxKaVJuQndWbXRXVm1ReFduRlNiVVphVm1zMVNWWnRkRzloTVVwMVVXeG9XbGRJUWxoVk1GcGhVMGRXU0ZKdGFFNVdNVW8yVm1wS01GbFdVWGhYYkdSVVlrZG9WMWxVUm1GaFJteFdWMjVrVTJKR2NGcFpWVnByVmpKS1IyTkVXbGROYmxKeVdYcEdWbVZXVG5KaVJrcFhVbGhDV1ZaR1dtRmtNV1JIWWtaV1VsZEhhRlJVVm1SVFRWWmFTR1ZHVG1oV01GWTJWVmQ0YzFkR1duUlZhbHBWVm14d2VsWnFSbXRYVm5CSVlVWk9WMVpHV2paV01XUXdXVlpaZDA1V1pHcFNiSEJ2VldwT1UxWnNVbGhrUm5CT1lrWmFNRnBGWkVkWFIwcFdWbXBTVjAxdVFsQldNRnBoWkVaV2MyRkdjRTVXYmtKSlZtMTRZVmxYVFhoV2JrNWhVbFJXYjFwWGRFZE9SbHAwWlVaa1dsWnNSalJXUnpWUFZXMUtSMU5zVmxkaE1VcEVXVEJXYzJKc1FsVk5SMnRwSWc9PSI=',
    );

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe('1832d446-7ce1-4570-b7cd-d935ce25a108');
  });

  it('should recursively decrypt a value that is encrypted by v3 and then by v1 encryption method', () => {
    // The original string is first encrypted by v3 and then by v1 encryption method
    defaultLocalStorage.setItem(
      'key',
      'RudderEncrypt:U2FsdGVkX1+fLoH8oM56BgjpAjU5f/LSM5J9NFK76wplt1ovIMcEK4MDVJY+A065',
    );

    const migratedVal = (storageMigrator.storage as ExtensionPoint).migrate?.(
      'key',
      defaultLocalStorage,
      defaultErrorHandler,
      defaultLogger,
    );
    expect(migratedVal).toBe('automationqa_123');
  });
});
