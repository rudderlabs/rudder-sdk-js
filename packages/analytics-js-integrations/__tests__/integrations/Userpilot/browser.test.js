/* eslint-disable no-underscore-dangle */
import Userpilot from '../../../src/integrations/Userpilot/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const mockUserpilotSDK = () => {
  window.userpilot = {
    identify: jest.fn(),
    track: jest.fn(),
    reload: jest.fn(),
    group: jest.fn(),
  };
};

beforeEach(() => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.id = 'dummyScript';
  const headElements = document.getElementsByTagName('head');
  headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  delete window.userpilot;
});

describe('Userpilot init tests', () => {
  test('Testing init call of Userpilot with token', () => {
    const userpilot = new Userpilot({ token: 'test-token' }, { logLevel: 'debug' }, destinationInfo);
    userpilot.init();
    expect(userpilot.name).toBe('USERPILOT');
    expect(userpilot.token).toBe('test-token');
  });
});

describe('Userpilot tests', () => {
  let userpilot;

  beforeEach(() => {
    userpilot = new Userpilot({ token: 'test-token' }, { logLevel: 'debug' }, destinationInfo);
    userpilot.init();
    mockUserpilotSDK();
    jest.spyOn(userpilot, 'isLoaded').mockImplementation(() => true);
  });

  test('Send identify with userId', () => {
    const spy = jest.spyOn(window.userpilot, 'identify');
    userpilot.identify({
      message: {
        userId: 'user-123',
        context: {
          traits: {
            name: 'John Doe',
            email: 'john@example.com',
            first_name: 'John',
            last_name: 'Doe',
            createdAt: '2022-01-01T00:00:00Z',
          },
        },
      },
    });

    expect(spy).toHaveBeenCalledWith('user-123', {
      name: 'John Doe',
      email: 'john@example.com',
      first_name: 'John',
      last_name: 'Doe',
      created_at: '2022-01-01T00:00:00Z',
    });
  });

  test('Send identify without userId should skip the call', () => {
    const spy = jest.spyOn(window.userpilot, 'identify');
    userpilot.identify({
      message: {
        anonymousId: 'anon-123',
        context: {
          traits: {
            name: 'Anonymous User',
          },
        },
      },
    });

    expect(spy).not.toHaveBeenCalled();
  });

  test('Send track event', () => {
    const spy = jest.spyOn(window.userpilot, 'track');
    userpilot.track({
      message: {
        event: 'Button Clicked',
        properties: {
          buttonName: 'Submit',
          page: 'Checkout',
        },
      },
    });

    expect(spy).toHaveBeenCalledWith('Button Clicked', {
      buttonName: 'Submit',
      page: 'Checkout',
    });
  });

  test('Send track event without properties', () => {
    const spy = jest.spyOn(window.userpilot, 'track');
    userpilot.track({
      message: {
        event: 'Page Viewed',
      },
    });

    expect(spy).toHaveBeenCalledWith('Page Viewed', undefined);
  });

  test('Track call without event name should not call userpilot.track', () => {
    const spy = jest.spyOn(window.userpilot, 'track');
    userpilot.track({
      message: {
        properties: {
          page: 'Home',
        },
      },
    });

    expect(spy).not.toHaveBeenCalled();
  });

  test('Send page call', () => {
    const spy = jest.spyOn(window.userpilot, 'reload');
    userpilot.page({
      message: {
        name: 'Home Page',
        properties: {
          url: 'https://example.com/home',
          path: '/home',
        },
      },
    });

    expect(spy).toHaveBeenCalledWith({ url: 'https://example.com/home' });
  });

  test('Send page call without URL', () => {
    const spy = jest.spyOn(window.userpilot, 'reload');
    userpilot.page({
      message: {
        name: 'Profile Page',
        properties: {
          path: '/profile',
        },
      },
    });

    expect(spy).toHaveBeenCalledWith();
  });

  test('Send group call', () => {
    const spy = jest.spyOn(window.userpilot, 'group');
    userpilot.group({
      message: {
        groupId: 'company-456',
        traits: {
          name: 'Acme Inc',
          industry: 'Technology',
          plan: 'enterprise',
        },
      },
    });

    expect(spy).toHaveBeenCalledWith('company-456', {
      name: 'Acme Inc',
      industry: 'Technology',
      plan: 'enterprise',
    });
  });

  test('Group call without groupId should not call userpilot.group', () => {
    const spy = jest.spyOn(window.userpilot, 'group');
    userpilot.group({
      message: {
        traits: {
          name: 'Acme Inc',
        },
      },
    });

    expect(spy).not.toHaveBeenCalled();
  });
}); 