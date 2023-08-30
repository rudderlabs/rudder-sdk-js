/* eslint-disable no-underscore-dangle */
import { Mixpanel } from '../../../src/integrations/Mixpanel';

describe('Mixpanel init tests', () => {
  let mixpanel;

  beforeEach(() => {
    window.mixpanel = {};
  });

  test('Persistence type is missing', () => {
    mixpanel = new Mixpanel({ persistence: 'none' }, { logLevel: 'debug' });
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      persistence: 'cookie',
    });
  });

  test('Persistence type is cookie', () => {
    mixpanel = new Mixpanel(
      { persistenceType: 'cookie', persistenceName: '' },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      persistence: 'cookie',
    });
  });

  test('Persistence type is localStorage and Persistence name is non empty', () => {
    mixpanel = new Mixpanel(
      { persistenceType: 'localStorage', persistenceName: 'abc' },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      persistence: 'localStorage',
      persistence_name: 'abc',
    });
  });

  test('Persistence type is none', () => {
    mixpanel = new Mixpanel(
      { persistenceType: 'none', persistenceName: '' },
      { logLevel: 'debug' },
    );
    mixpanel.init();
    expect(window.mixpanel._i[0][1]).toEqual({
      cross_subdomain_cookie: false,
      secure_cookie: false,
      disable_persistence: true,
    });
  });
});
