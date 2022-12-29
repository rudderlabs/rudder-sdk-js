import { OneTrust } from '../src/features/core/cookieConsent/OneTrust';

window.OneTrust = {
  GetDomainData: jest.fn(() => ({
      Groups: [
        { CustomGroupId: 'C0001', GroupName: 'Functional Cookies' },
        { CustomGroupId: 'C0003', GroupName: 'Analytical Cookies' },
      ],
    })),
};
window.OnetrustActiveGroups = ',C0001,C0003,';

const oneTrust = new OneTrust();

describe('Test suit for OneTrust cookie consent manager', () => {
  it('Should allow events when no category is set in destination config', () => {
    const destConfig = {};
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when oneTrustCookieCategory in destination config is present in consented categories', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'analytical cookies' }],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when category ID in destination config is present in consented category IDs', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'c0003' }],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when category ID and name both is present in destination config and present in consented categories', () => {
    const destConfig = {
      oneTrustCookieCategories: [
        { oneTrustCookieCategory: 'c0001' },
        { oneTrustCookieCategory: 'Analytical Cookies' },
      ],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should not allow events when consented category name is not present in destination config', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'Performance Cookies' }],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
  it('Should not allow events when consented category ID is not present in destination config', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'c0005' }],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
  it('Should not allow events when all the category IDs in destination config present in consented category IDs', () => {
    const destConfig = {
      oneTrustCookieCategories: [
        { oneTrustCookieCategory: 'c0001' },
        { oneTrustCookieCategory: 'c0005' },
      ],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
  it('Should not allow events when all the category IDs/names in destination config present in consented category IDs/names', () => {
    const destConfig = {
      oneTrustCookieCategories: [
        { oneTrustCookieCategory: 'analytical cookies' },
        { oneTrustCookieCategory: 'c0005' },
      ],
    };
    const allowEvent = oneTrust.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
});
