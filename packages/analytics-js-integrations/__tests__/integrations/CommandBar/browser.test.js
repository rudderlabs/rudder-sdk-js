import CommandBar from '../../../src/integrations/CommandBar/browser';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('CommandBar init tests', () => {
  let Commandbar;

  test('Testing init call of CommandBar', () => {
    Commandbar = new CommandBar({ orgId: '12567839' }, { loglevel: 'debug' }, destinationInfo);
    Commandbar.init();
    expect(typeof window.CommandBar).toBe('object');
  });
});

describe('CommandBar Track event', () => {
  let Commandbar;
  Commandbar = new CommandBar({ orgId: '12567839' }, { loglevel: 'debug' }, destinationInfo);
  Commandbar.init();
  window.CommandBar.trackEvent = jest.fn();
  test('Testing Track Events', () => {
    Commandbar.track({
      message: {
        context: {},
        event: 'dummyEventName',
        properties: {
          customProp: 'testProp',
        },
      },
    });
    expect(window.CommandBar.trackEvent.mock.calls[0][0]).toEqual('dummyEventName');
    expect(window.CommandBar.trackEvent.mock.calls[0][1]).toEqual({});
  });
});
describe('CommandBar Identify event', () => {
  let Commandbar;
  Commandbar = new CommandBar({ orgId: '12567839' }, { loglevel: 'debug' }, destinationInfo);
  Commandbar.init();
  window.CommandBar.boot = jest.fn();
  test('Testing Identify sending traits in context and hmacId as well', () => {
    Commandbar.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@ruddertack.com',
            isRudderEvents: true,
            hmacId: 'hmacUserId',
          },
        },
      },
    });
    expect(window.CommandBar.boot.mock.calls[0][0]).toEqual('rudder01');
    expect(window.CommandBar.boot.mock.calls[0][1]).toEqual({
      email: 'abc@ruddertack.com',
      isRudderEvents: true,
    });
    expect(window.CommandBar.boot.mock.calls[0][2]).toEqual({
      hmac: 'hmacUserId',
    });
  });
  test('Testing Identify sending traits in message and hmacId in traits.context ', () => {
    Commandbar.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@ruddertack.com',
            isRudderEvents: true,
          },
        },
        traits: {
          hmacId: 'hmacUserId',
        },
      },
    });
    expect(window.CommandBar.boot.mock.calls[0][0]).toEqual('rudder01');
    expect(window.CommandBar.boot.mock.calls[0][1]).toEqual({
      email: 'abc@ruddertack.com',
      isRudderEvents: true,
    });
    expect(window.CommandBar.boot.mock.calls[0][2]).toEqual({
      hmac: 'hmacUserId',
    });
  });
  test('Testing Identify no traits or hmacId passed ', () => {
    Commandbar.identify({
      message: {
        userId: 'rudder01',
        context: {
          traits: {
            email: 'abc@ruddertack.com',
            isRudderEvents: true,
          },
        },
        traits: {
          hmacId: 'hmacUserId',
        },
      },
    });
    expect(window.CommandBar.boot.mock.calls[0][0]).toEqual('rudder01');
    expect(window.CommandBar.boot.mock.calls[0][1]).toEqual({
      email: 'abc@ruddertack.com',
      isRudderEvents: true,
    });
    expect(window.CommandBar.boot.mock.calls[0][2]).toEqual({
      hmac: 'hmacUserId',
    });
  });
});
