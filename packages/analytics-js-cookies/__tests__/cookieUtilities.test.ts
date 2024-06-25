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
import { encrypt, decrypt, getDecryptedCookie } from '../src/cookiesUtilities';

describe('Cookie Utilities', () => {
  describe('encrypt', () => {
    it('should encrypt the value', () => {
      expect(encrypt('test-data')).toBe('RS_ENC_v3_dGVzdC1kYXRh');
    });
  });

  describe('decrypt', () => {
    it('should decrypt the value', () => {
      expect(decrypt('RS_ENC_v3_dGVzdC1kYXRh')).toBe('test-data');
    });

    it('should return same data if it is not a supported encryption format', () => {
      expect(decrypt('test-data')).toBe('test-data');
    });

    it('should throw error if the value is not properly encrypted', () => {
      expect(() => decrypt('RS_ENC_v3_dGVzdC1kYXRh-some-random-data')).toThrow();
    });
  });

  describe('getDecryptedCookie', () => {
    it('should return the decrypted cookie value', () => {
      // JSON.stringify('test-data') -> '"test-data"'
      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YSI=';
      expect(getDecryptedCookie('rl_anonymous_id')).toBe('test-data');

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the cookie is not present', () => {
      expect(getDecryptedCookie('rl_anonymous_id')).toBeNull();
    });

    it('should return value if the cookie is not encrypted', () => {
      document.cookie = 'rl_anonymous_id="test-data"';
      expect(getDecryptedCookie('rl_anonymous_id')).toBe('test-data');

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the cookie is not properly encrypted', () => {
      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YQ==';
      expect(getDecryptedCookie('rl_anonymous_id')).toBeNull();

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the cookie value is not parsable', () => {
      // the encrypted value is '"test-data' (missing closing double quote)

      document.cookie = 'rl_anonymous_id=RS_ENC_v3_InRlc3QtZGF0YQ==';
      expect(getDecryptedCookie('rl_anonymous_id')).toBeNull();

      // delete cookie
      document.cookie = 'rl_anonymous_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    });

    it('should return null if the provided cookie name is not valid', () => {
      expect(getDecryptedCookie('invalid_cookie_name')).toBeNull();
    });

    it('should return decrypted cookie value if the cookie value is an object', () => {
      document.cookie = 'rl_trait=RS_ENC_v3_ewogICJ0ZXN0LWtleSI6ICJ0ZXN0LXZhbHVlIgp9';
      expect(getDecryptedCookie('rl_trait')).toEqual({ 'test-key': 'test-value' });

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
      expect(getDecryptedCookie(userIdKey)).toBe('test-user_id');
      expect(getDecryptedCookie(userTraitsKey)).toEqual({ 'test-key': 'test-value' });
      expect(getDecryptedCookie(anonymousUserIdKey)).toBe('test-data');
      expect(getDecryptedCookie(groupIdKey)).toBe('test-group_id');
      expect(getDecryptedCookie(groupTraitsKey)).toEqual({ 'test-key': 'test-value' });
      expect(getDecryptedCookie(pageInitialReferrerKey)).toBe('test-page_init_referrer');
      expect(getDecryptedCookie(pageInitialReferringDomainKey)).toBe(
        'test-page_init_referring_domain',
      );
      expect(getDecryptedCookie(sessionInfoKey)).toEqual({ 'test-key': 'test-value' });
      expect(getDecryptedCookie(authTokenKey)).toBe('test-token');

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
});
