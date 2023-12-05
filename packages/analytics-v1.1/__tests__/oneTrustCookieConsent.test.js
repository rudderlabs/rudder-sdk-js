import { OneTrust } from '../src/features/core/cookieConsent/OneTrust';

window.OneTrust = {
  GetDomainData: jest.fn(() => ({
    Groups: [
      { CustomGroupId: 'C0001', GroupName: 'Functional Cookies' },
      { CustomGroupId: 'C0002', GroupName: 'Performance Cookies' },
      { CustomGroupId: 'C0003', GroupName: 'Analytical Cookies' },
      { CustomGroupId: 'C0004', GroupName: 'Targeting Cookies' },
      { CustomGroupId: 'C0005', GroupName: 'Social Media Cookies' },
      { CustomGroupId: 'C0006', GroupName: 'Advertisement Cookies' },
    ],
  })),
};
window.OnetrustActiveGroups = ',C0001,C0003,';

const expectedDeniedConsentIds = ['C0002', 'C0004', 'C0005', 'C0006'];
const expectedConsentedConsentIds = {
  C0001: 'Functional Cookies',
  C0003: 'Analytical Cookies',
};
const provider = 'oneTrust';
const resolutionStrategy = 'and';

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
  it('Should return the entire consent information', () => {
    const cmInfo = oneTrust.getConsentManagementInfo();
    expect(cmInfo).toEqual({
      allowedConsentIds: expectedConsentedConsentIds,
      deniedConsentIds: expectedDeniedConsentIds,
      provider,
      resolutionStrategy,
    });
  });
});
