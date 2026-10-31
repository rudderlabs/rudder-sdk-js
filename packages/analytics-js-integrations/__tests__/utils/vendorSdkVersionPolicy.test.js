import { resolveVendorSdkVersionPolicy } from '../../src/utils/vendorSdkVersionPolicy';

describe('vendor SDK version policy', () => {
  it('resolves destination then All then pinned', () => {
    expect(resolveVendorSdkVersionPolicy(undefined, 'Bugsnag')).toBe('pinned');
    expect(resolveVendorSdkVersionPolicy({ All: true }, 'Bugsnag')).toBe('pinned');
    expect(
      resolveVendorSdkVersionPolicy(
        {
          All: { vendorSdkVersionPolicy: 'strict' },
          Bugsnag: { vendorSdkVersionPolicy: 'floating' },
        },
        'Bugsnag',
      ),
    ).toBe('floating');
    expect(
      resolveVendorSdkVersionPolicy(
        { All: { vendorSdkVersionPolicy: 'strict' }, GA4: { vendorSdkVersionPolicy: 'floating' } },
        'Google Analytics 4 (GA4)',
      ),
    ).toBe('strict');
  });

  it('inherits All for entries without a valid policy', () => {
    for (const entry of [
      true,
      false,
      undefined,
      [],
      'enabled',
      {},
      { apiKey: 'key' },
      null,
      { vendorSdkVersionPolicy: 'latest' },
      { vendorSdkVersionPolicy: 0 },
    ]) {
      expect(
        resolveVendorSdkVersionPolicy(
          { All: { vendorSdkVersionPolicy: 'strict' }, Bugsnag: entry },
          'Bugsnag',
        ),
      ).toBe('strict');
    }
    expect(
      resolveVendorSdkVersionPolicy({ All: { vendorSdkVersionPolicy: 'latest' } }, 'Bugsnag'),
    ).toBe('pinned');
  });
});
