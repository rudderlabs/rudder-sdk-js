import { Osano } from '../src/features/core/cookieConsent/Osano';

window.Osano = {
  cm: {
    getConsent: jest.fn(() => ({
      ANALYTICS: 'ACCEPT',
      MARKETING: 'ACCEPT',
      PERSONALIZATION: 'ACCEPT',
      ESSENTIAL: 'ACCEPT',
      'OPT-OUT': 'ACCEPT',
      STORAGE: 'ACCEPT',
    })),
  },
};

const osano = new Osano();

describe('Test suit for Osano cookie consent manager', () => {
  it('Should allow events when no category is set in destination config', () => {
    const destConfig = {};
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when oneTrustCookieCategory in destination config is present in consented categories', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'analytics' }],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when category ID in destination config is present in consented category IDs', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'c0003' }],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should allow events when category ID and name both is present in destination config and present in consented categories', () => {
    const destConfig = {
      oneTrustCookieCategories: [
        { oneTrustCookieCategory: 'c0001' },
        { oneTrustCookieCategory: 'Analytics' },
      ],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(true);
  });
  it('Should not allow events when consented category name is not present in destination config', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'Performance' }],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
  it('Should not allow events when consented category ID is not present in destination config', () => {
    const destConfig = {
      oneTrustCookieCategories: [{ oneTrustCookieCategory: 'c0006' }],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
  it('Should not allow events when all the category IDs in destination config present in consented category IDs', () => {
    const destConfig = {
      oneTrustCookieCategories: [
        { oneTrustCookieCategory: 'c0001' },
        { oneTrustCookieCategory: 'c0006' },
      ],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
  it('Should not allow events when all the category IDs/names in destination config present in consented category IDs/names', () => {
    const destConfig = {
      oneTrustCookieCategories: [
        { oneTrustCookieCategory: 'analytical cookies' },
        { oneTrustCookieCategory: 'c0005' },
      ],
    };
    const allowEvent = osano.isEnabled(destConfig);
    expect(allowEvent).toBe(false);
  });
});
