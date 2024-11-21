import {
  anonymousUserIdKey,
  authTokenKey,
  groupIdKey,
  groupTraitsKey,
  pageInitialReferrerKey,
  pageInitialReferringDomainKey,
  sessionInfoKey,
  userIdKey,
  userTraitsKey,
} from '../src';
import {
  encryptBrowser,
  decryptBrowser,
  getDecryptedValueBrowser,
  getDecryptedCookieBrowser,
  getEncryptedValueBrowser,
  getDecryptedValue,
  getEncryptedValue,
} from '../src/cookiesUtilities';

describe('Cookie Utilities', () => {
  describe('encryptBrowser', () => {
    it('should encrypt the value', () => {
      expect(encryptBrowser('test-data')).toBe('RS_ENC_v3_dGVzdC1kYXRh');
    });
  });

  describe('decryptBrowser', () => {
    it('should decrypt the value', () => {
      expect(decryptBrowser('RS_ENC_v3_dGVzdC1kYXRh')).toBe('test-data');
    });

    it('should return same data if it is not a supported encryption format', () => {
      expect(decryptBrowser('test-data')).toBe('test-data');
    });

    it('should throw error if the value is not properly encrypted', () => {
      expect(() => decryptBrowser('RS_ENC_v3_dGVzdC1kYXRh-some-random-data')).toThrow();
    });
  });

  describe('getDecryptedValueBrowser', () => {
    it('should return the decrypted value', () => {
      expect(getDecryptedValueBrowser('RS_ENC_v3_InRlc3QtZGF0YSI=')).toBe('test-data');
    });

    it('should return null if it is not encrypted', () => {
      expect(getDecryptedValueBrowser('test-data')).toBeNull();
    });

    it('should return null if the value is not properly encrypted', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      expect(
        getDecryptedValueBrowser('RS_ENC_v3_InRlc3QtZGF0YSI-some-random-data', true),
      ).toBeNull();

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        1,
        'Error occurred during decryption: ',
        new Error('The string to be decoded contains invalid characters.'),
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return null if the input is null', () => {
      expect(getDecryptedValueBrowser(null)).toBeNull();
    });

    it('should return null if the input is undefined', () => {
      expect(getDecryptedValueBrowser(undefined)).toBeNull();
    });
  });

  describe('getDecryptedCookieBrowser', () => {
    it('should return the decrypted cookie value', () => {
      // JSON.stringify('test-data') -> '"test-data"'
      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YSI=';
      expect(getDecryptedCookieBrowser('rl_anonymous_id')).toBe('test-data');

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the cookie is not present', () => {
      expect(getDecryptedCookieBrowser('rl_anonymous_id')).toBeNull();
    });

    it('should return value if the cookie is not encrypted', () => {
      document.cookie = 'rl_anonymous_id="test-data"';
      expect(getDecryptedCookieBrowser('rl_anonymous_id')).toBe('test-data');

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the cookie is not properly encrypted', () => {
      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YQ==';
      expect(getDecryptedCookieBrowser('rl_anonymous_id')).toBeNull();

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the cookie value is not parsable', () => {
      // the encrypted value is '"test-data' (missing closing double quote)

      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YQ==';
      expect(getDecryptedCookieBrowser('rl_anonymous_id')).toBeNull();

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the provided cookie name is not valid', () => {
      expect(getDecryptedCookieBrowser('invalid_cookie_name')).toBeNull();
    });

    it('should return decrypted cookie value if the cookie value is an object', () => {
      document.cookie = 'rl_trait=RS_ENC_v3_ewogICJ0ZXN0LWtleSI6ICJ0ZXN0LXZhbHVlIgp9';
      expect(getDecryptedCookieBrowser('rl_trait')).toEqual({ 'test-key': 'test-value' });

      // delete cookie
      document.cookie = 'rl_trait=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return decrypted cookie values for all the allowed cookies', () => {
      document.cookie = 'rl_user_id=RS_ENC_v3_InRlc3QtdXNlcl9pZCI=';
      document.cookie = 'rl_trait=RS_ENC_v3_ewogICJ0ZXN0LWtleSI6ICJ0ZXN0LXZhbHVlIgp9';
      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YSI=';
      document.cookie = 'rl_group_id=RS_ENC_v3_InRlc3QtZ3JvdXBfaWQi';
      document.cookie = 'rl_group_trait=RS_ENC_v3_ewogICJ0ZXN0LWtleSI6ICJ0ZXN0LXZhbHVlIgp9';
      document.cookie = 'rl_page_init_referrer=RS_ENC_v3_InRlc3QtcGFnZV9pbml0X3JlZmVycmVyIg==';
      document.cookie =
        'rl_page_init_referring_domain=RS_ENC_v3_InRlc3QtcGFnZV9pbml0X3JlZmVycmluZ19kb21haW4i';
      document.cookie = 'rl_session=RS_ENC_v3_ewogICJ0ZXN0LWtleSI6ICJ0ZXN0LXZhbHVlIgp9';
      document.cookie = 'rl_auth_token=RS_ENC_v3_InRlc3QtdG9rZW4i';
      expect(getDecryptedCookieBrowser(userIdKey)).toBe('test-user_id');
      expect(getDecryptedCookieBrowser(userTraitsKey)).toEqual({ 'test-key': 'test-value' });
      expect(getDecryptedCookieBrowser(anonymousUserIdKey)).toBe('test-data');
      expect(getDecryptedCookieBrowser(groupIdKey)).toBe('test-group_id');
      expect(getDecryptedCookieBrowser(groupTraitsKey)).toEqual({ 'test-key': 'test-value' });
      expect(getDecryptedCookieBrowser(pageInitialReferrerKey)).toBe('test-page_init_referrer');
      expect(getDecryptedCookieBrowser(pageInitialReferringDomainKey)).toBe(
        'test-page_init_referring_domain',
      );
      expect(getDecryptedCookieBrowser(sessionInfoKey)).toEqual({ 'test-key': 'test-value' });
      expect(getDecryptedCookieBrowser(authTokenKey)).toBe('test-token');

      // delete cookies
      document.cookie = 'rl_user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_trait=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_group_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_group_trait=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_page_init_referrer=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_page_init_referring_domain=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
      document.cookie = 'rl_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });
  });

  describe('getEncryptedValueBrowser', () => {
    it('should encrypt the value', () => {
      expect(getEncryptedValueBrowser('test-data')).toBe('RS_ENC_v3_InRlc3QtZGF0YSI=');
    });

    it('should encrypt the object value', () => {
      expect(getEncryptedValueBrowser({ testKey: 'test-value' })).toBe(
        'RS_ENC_v3_eyJ0ZXN0S2V5IjoidGVzdC12YWx1ZSJ9',
      );
    });

    it('should return encoded value if the input contains unicode characters', () => {
      const inputVal = { testKey: '✓' };
      expect(getEncryptedValueBrowser(inputVal)).toBe('RS_ENC_v3_eyJ0ZXN0S2V5Ijoi4pyTIn0=');
    });

    it('should return null if an exception is thrown during encryption', () => {
      const originalBtoa = (globalThis as typeof window).btoa;
      (globalThis as typeof window).btoa = () => {
        throw new Error('Error while encoding.');
      };
      const consoleErrorSpy = jest.spyOn(console, 'error');

      expect(getEncryptedValueBrowser('test-data', true)).toBeNull();

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        1,
        'Error occurred during encryption: ',
        new Error('Error while encoding.'),
      );

      // restore original btoa
      (globalThis as typeof window).btoa = originalBtoa;

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getDecryptedValue', () => {
    it('should return the decrypted value', () => {
      expect(getDecryptedValue('RS_ENC_v3_InRlc3QtZGF0YSI=')).toBe('test-data');
    });

    it('should return null if it is not encrypted', () => {
      expect(getDecryptedValue('test-data')).toBeNull();
    });

    it('should return null if the value is not properly encrypted', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      expect(getDecryptedValue('RS_ENC_v3_InRlc3QtZGF0YSI-some-random-data', true)).toBeNull();

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(
        1,
        'Error occurred during decryption: ',
        new SyntaxError('Unexpected non-whitespace character after JSON at position 11'),
      );

      consoleErrorSpy.mockRestore();
    });

    it('should return null if the input is null', () => {
      expect(getDecryptedValue(null)).toBeNull();
    });

    it('should return null if the input is undefined', () => {
      expect(getDecryptedValue(undefined)).toBeNull();
    });
  });

  describe('getEncryptedValue', () => {
    it('should encrypt the value', () => {
      expect(getEncryptedValue('test-data')).toBe('RS_ENC_v3_InRlc3QtZGF0YSI=');
    });

    it('should encrypt the object value', () => {
      expect(getEncryptedValue({ testKey: 'test-value' })).toBe(
        'RS_ENC_v3_eyJ0ZXN0S2V5IjoidGVzdC12YWx1ZSJ9',
      );
    });

    it('should return encoded value if the input contains unicode characters', () => {
      const inputVal = { testKey: '✓' };
      expect(getEncryptedValue(inputVal)).toBe('RS_ENC_v3_eyJ0ZXN0S2V5Ijoi4pyTIn0=');
    });
  });
});
