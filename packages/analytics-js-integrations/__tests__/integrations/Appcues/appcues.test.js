import { Appcues } from '../../../src/integrations/Appcues';

const appcuesConfig = {
  accountId: '812354',
  eventFilteringOption: 'disable',
  whitelistedEvents: [],
  blacklistedEvents: [],
  oneTrustCookieCategories: [],
  nativeSdkUrl: { web: '' },
  useNativeSDK: { web: true },
};
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
const testEmail = 'test@email.com';

const mockAppcuesSDK = () => {
  window.Appcues = {
    identify: jest.fn(),
    track: jest.fn(),
    page: jest.fn(),
    group: jest.fn(),
  };
};

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
});

describe('Appcues init tests', () => {
  let appcues;

  beforeEach(() => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' }, destinationInfo);
    appcues.init();
  });

  it('Testing init call of Appcues', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    expect(typeof appcues).toBe('object');
  });
});

describe('Appcues identify tests', () => {
  let appcues;
  const rudderElement = {
    message: {
      type: 'identify',
      context: {
        traits: {
          name: 'test',
          email: testEmail,
          address: {
            city: 'testCity',
            state: 'testState',
          },
        },
      },
      userId: 'testUserId',
    },
  };
  it('Testing identify call of Appcues with nested object traits', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    mockAppcuesSDK();
    const spy = jest.spyOn(window.Appcues, 'identify');
    appcues.identify(rudderElement);
    expect(spy).toHaveBeenCalledWith('testUserId', {
      name: 'test',
      email: testEmail,
      'address.city': 'testCity',
      'address.state': 'testState',
    });
  });

  it('Testing missing user id for identify calls', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    mockAppcuesSDK();
    const spy = jest.spyOn(window.Appcues, 'identify');
    appcues.identify({
      message: {
        type: 'identify',
        context: {
          traits: {
            email: 'test2@email.com',
          },
        },
      },
    });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('Appcues track tests', () => {
  let appcues;
  const rudderElement = {
    message: {
      type: 'track',
      event: 'testEvent',
      properties: {
        name: 'test',
        email: testEmail,
      },
    },
  };
  it('Testing track call of Appcues', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    mockAppcuesSDK();
    const spy = jest.spyOn(window.Appcues, 'track');
    appcues.track(rudderElement);
    expect(spy).toHaveBeenCalledWith('testEvent', {
      name: 'test',
      email: testEmail,
    });
  });

  it('Testing missing event name for track calls', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    mockAppcuesSDK();
    const spy = jest.spyOn(window.Appcues, 'track');
    appcues.track({
      message: {
        type: 'track',
        properties: {
          name: 'test',
        },
      },
    });
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('Appcues page tests', () => {
  let appcues;
  const rudderElement = {
    message: {
      type: 'page',
      name: 'testPage',
      properties: {
        name: 'test',
      },
    },
  };
  it('Testing page call of Appcues', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    mockAppcuesSDK();
    const spy = jest.spyOn(window.Appcues, 'page');
    appcues.page(rudderElement);
    expect(spy).toHaveBeenCalledWith('testPage', {
      name: 'test',
    });
  });
});
describe('Appcues group tests', () => {
  let appcues;
  const rudderElement = {
    message: {
      type: 'group',
      groupId: 'testid',
      traits: {
        name: 'test',
      },
    },
  };
  it('Testing group call of Appcues', () => {
    appcues = new Appcues(appcuesConfig, { loglevel: 'debug' });
    appcues.init();
    mockAppcuesSDK();
    const spy = jest.spyOn(window.Appcues, 'group');
    appcues.group(rudderElement);
    expect(spy).toHaveBeenCalledWith('testid', {
      name: 'test',
    });
  });
});
