/* eslint-disable no-underscore-dangle */
import Sprig from '../../../src/integrations/Sprig/browser';

const url = 'http://localhost:3004';
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

beforeEach(() => {
  // Add a dummy script as it is required by the init script
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window.Sprig;
});
describe('Sprig init tests', () => {
  test('Testing init call of Sprig with environmentId', () => {
    const sprig = new Sprig({ environmentId: '12345' }, {}, destinationInfo);
    sprig.init();
    expect(typeof window.Sprig).toBe('function');
  });
});

describe('Sprig tests', () => {
  let sprig;
  beforeEach(() => {
    sprig = new Sprig({ environmentId: '12345' }, {}, destinationInfo);
    sprig.init();
  });

  test('Send identify', () => {
    sprig.identify({
      message: {
        userId: 'user@1',
        context: {
          traits: {
            country: 'USA',
            email: 'test@rudderlabs.com',
            source: 'js-sdk',
          },
        },
      },
    });
    console.log(window.Sprig._queue[1]);
    expect(window.Sprig._queue[0][1]).toEqual('user@1');
    expect(window.Sprig._queue[1][1]).toEqual('test@rudderlabs.com');
    expect(window.Sprig._queue[2][1]).toEqual({
      country: 'USA',
      source: 'js-sdk',
    });
  });

  test('Send signed in track event', () => {
    sprig.track({
      message: {
        userId: 'user@1',
        event: 'signed in',
        properties: {
          url,
        },
      },
    });
    expect(window.Sprig._queue[0][1]).toEqual({
      eventName: 'signed in',
      properties: { url },
      userId: 'user@1',
    });
  });

  test('Send signed out track event', () => {
    sprig.track({
      message: {
        userId: 'user@1',
        event: 'signed out',
        properties: {
          url,
        },
      },
    });
    expect(window.Sprig._queue[0][0]).toEqual('logoutUser');
  });
});
