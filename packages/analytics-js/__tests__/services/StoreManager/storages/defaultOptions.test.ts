import { domain } from '../../../../src/services/StoreManager/top-domain';
import { getDefaultCookieOptions } from '../../../../src/services/StoreManager/storages/defaultOptions';

jest.mock('../../../../src/services/StoreManager/top-domain', () => ({
  domain: jest.fn().mockReturnValue('example.com'),
}));
describe('getDefaultCookieOptions', () => {
  it('should return default cookie options with a valid top domain', () => {
    const result = getDefaultCookieOptions();
    expect(result).toEqual({
      maxage: 31536000000,
      path: '/',
      domain: '.example.com',
      samesite: 'Lax',
      enabled: true,
    });
  });
  it('should return default cookie options with undefined domain', () => {
    (domain as jest.Mock).mockReturnValueOnce('');
    const result = getDefaultCookieOptions();
    expect(result).toEqual({
      maxage: 31536000000,
      path: '/',
      domain: undefined,
      samesite: 'Lax',
      enabled: true,
    });
  });
});
