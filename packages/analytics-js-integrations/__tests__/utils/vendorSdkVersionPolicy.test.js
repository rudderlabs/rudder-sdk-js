import { resolveVendorSdkVersionPolicy } from '../../src/utils/vendorSdkVersionPolicy';

describe('vendor SDK version policy', () => {
  test.each([undefined, {}, { Bugsnag: { vendorSdkVersionPolicy: 'strict' } }])(
    'defaults to pinned and ignores destination strict: %p',
    integrations => {
      expect(resolveVendorSdkVersionPolicy(integrations)).toBe('pinned');
    },
  );

  test.each([
    undefined,
    null,
    true,
    false,
    'strict',
    0,
    [],
    {},
    { vendorSdkVersionPolicy: 'pinned' },
    { vendorSdkVersionPolicy: 'floating' },
    { vendorSdkVersionPolicy: 'latest' },
    { vendorSdkVersionPolicy: 0 },
  ])('ignores unsupported All entries: %p', All => {
    expect(resolveVendorSdkVersionPolicy({ All })).toBe('pinned');
  });

  test.each([
    undefined,
    null,
    true,
    false,
    {},
    { vendorSdkVersionPolicy: 'pinned' },
    { vendorSdkVersionPolicy: 'floating' },
    { vendorSdkVersionPolicy: 'strict' },
  ])('global strict ignores destination entries: %p', Bugsnag => {
    expect(
      resolveVendorSdkVersionPolicy({ All: { vendorSdkVersionPolicy: 'strict' }, Bugsnag }),
    ).toBe('strict');
  });
});
