import { legacyDecrypt } from '@rudderstack/analytics-js-plugins/storageEncryption/legacyDecryptV1';

describe('Storage Encryption - Legacy Decrypt', () => {
  it('should decrypt the encrypted string', () => {
    expect(
      legacyDecrypt(
        'RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/',
      ),
    ).toBe('"1wefk7M3Y1D6EDX4ZpIE00LpKAE"');
  });

  it('should return empty string if encryption prefix is missing', () => {
    expect(legacyDecrypt('U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h/')).toBe(
      '',
    );
  });

  it('should return empty string if the encrypted data is corrupted', () => {
    expect(
      legacyDecrypt(
        'RudderEncrypt:U2FsdGVkX1+5q5jikppUASe8AdIH6O2iORyF41sYXgxzIGiX9whSeVxxww0OK5h',
      ),
    ).toBe('');
  });
});
