import { resolveVendorSdkVersionPolicy } from '../../src/utils/vendorSdkVersionPolicy';

describe('vendor SDK version policy', () => {
  test('accepts the strict load option', () => {
    expect(resolveVendorSdkVersionPolicy('strict')).toBe('strict');
  });

  test.each([
    undefined,
    null,
    true,
    false,
    0,
    [],
    {},
    'pinned',
    'floating',
    'latest',
    { All: { vendorSdkVersionPolicy: 'strict' } },
    { Bugsnag: { vendorSdkVersionPolicy: 'strict' } },
  ])('defaults to pinned for invalid policy: %p', policy => {
    expect(resolveVendorSdkVersionPolicy(policy)).toBe('pinned');
  });
});
