import MoEngage from '../../../src/integrations/MoEngage/browser';

const mockMoEngageSDK = () => {
  (window as any).Moengage = {
    track_event: jest.fn(),
    add_user_attribute: jest.fn(),
    add_user_name: jest.fn(),
    add_first_name: jest.fn(),
    add_last_name: jest.fn(),
    add_email: jest.fn(),
    add_mobile: jest.fn(),
    add_gender: jest.fn(),
    add_birthday: jest.fn(),
    add_unique_user_id: jest.fn(),
    destroy_session: jest.fn().mockResolvedValue('done'),
    identifyUser: jest.fn().mockResolvedValue('done'),
  };
};

describe('MoEngage init tests', () => {
  test('Testing init call of MoEngage with apiId', () => {
    mockMoEngageSDK();
    const moEngage = new MoEngage(
      { apiId: 'test-api-id', debug: true, region: 'US' },
      { logLevel: 'debug', getUserId: () => 'user123' },
    );
    moEngage.init();
    expect(moEngage.name).toBe('MOENGAGE');
    expect(moEngage.apiId).toBe('test-api-id');
    expect(moEngage.debug).toBe(true);
    expect(moEngage.region).toBe('US');
    expect(moEngage.moengageRegion).toBeDefined();
  });

  test('Testing data center calculation', () => {
    const moEngageEU = new MoEngage(
      { apiId: 'test-api-id', region: 'EU' },
      { logLevel: 'debug', getUserId: () => null },
    );
    moEngageEU.init();
    expect(moEngageEU.moengageRegion).toBe('dc_2');

    const moEngageIN = new MoEngage(
      { apiId: 'test-api-id', region: 'IN' },
      { logLevel: 'debug', getUserId: () => null },
    );
    moEngageIN.init();
    expect(moEngageIN.moengageRegion).toBe('dc_3');
  });

  test('Testing default data center calculation', () => {
    const moEngageDefault = new MoEngage(
      { apiId: 'test-api-id' },
      { logLevel: 'debug', getUserId: () => null },
    );
    moEngageDefault.init();
    expect(moEngageDefault.moengageRegion).toBe('dc_1'); // Assuming US is default
  });
});

describe('MoEngage isLoaded tests', () => {
  let moEngage: MoEngage;

  beforeEach(() => {
    moEngage = new MoEngage(
      { apiId: 'test-api-id', debug: true },
      { logLevel: 'debug', getUserId: () => 'user123' },
    );
  });

  test('isLoaded returns false when Moengage is not defined', () => {
    (window as any).Moengage = undefined;
    expect(moEngage.isLoaded()).toBe(false);
  });

  test('isLoaded returns false when Moengage exists but track_event is not a function', () => {
    (window as any).Moengage = { track_event: jest.fn() };
    (window as any).moeBannerText = undefined;

    expect(moEngage.isLoaded()).toBe(false);
  });

  test('isLoaded returns true when Moengage exists and track_event is a function', () => {
    (window as any).Moengage = { track_event: jest.fn() };
    (window as any).moeBannerText = 'MoEngage Initialized';

    expect(moEngage.isLoaded()).toBe(true);
  });
});

describe('MoEngage reset tests', () => {
  let moEngage: MoEngage;

  beforeEach(() => {
    moEngage = new MoEngage(
      { apiId: 'test-api-id', debug: true },
      { logLevel: 'debug', getUserId: () => 'newUser' },
    );
    moEngage.init();
    mockMoEngageSDK();
    jest.spyOn(moEngage, 'isLoaded').mockImplementation(() => true);
  });

  test('reset should update currentUserId and destroy session', () => {
    const spy = jest.spyOn((window as any).Moengage, 'destroy_session').mockResolvedValue('done');
    moEngage.resetSession('newUser');

    expect((moEngage as any).currentUserId).toBe('newUser');
    expect(spy).toHaveBeenCalled();
  });
});

describe('MoEngage track tests', () => {
  let moEngage: MoEngage;

  beforeEach(() => {
    moEngage = new MoEngage(
      { apiId: 'test-api-id', debug: true },
      { logLevel: 'debug', getUserId: () => 'user123' },
    );
    moEngage.init();
    mockMoEngageSDK();
    (moEngage as any).currentUserId = 'user123';
    jest.spyOn(moEngage, 'isLoaded').mockImplementation(() => true);
  });

  test('track event with properties', () => {
    const spy = jest.spyOn((window as any).Moengage, 'track_event');
    moEngage.track({
      message: {
        event: 'Test Event',
        properties: {
          category: 'test',
          value: 100,
        },
        userId: 'user123',
      },
    });

    expect(spy).toHaveBeenCalledWith('Test Event', {
      category: 'test',
      value: 100,
    });
  });

  test('track event without properties', () => {
    const spy = jest.spyOn((window as any).Moengage, 'track_event');
    moEngage.track({
      message: {
        event: 'Test Event',
        userId: 'user123',
      },
    });

    expect(spy).toHaveBeenCalledWith('Test Event');
  });

  test('track event with different userId should reset session', () => {
    const resetSpy = jest.spyOn(moEngage, 'resetSession');
    moEngage.track({
      message: {
        event: 'Test Event',
        userId: 'differentUser',
      },
    });

    expect(resetSpy).toHaveBeenCalled();
  });

  test('track event without event name should log error', () => {
    const loggerSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    moEngage.track({
      message: {
        properties: { test: 'value' },
      },
    });

    expect(loggerSpy).toHaveBeenCalled();
    loggerSpy.mockRestore();
  });

  test('track event with invalid payload should log error', () => {
    const loggerSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    moEngage.track({});

    expect(loggerSpy).toHaveBeenCalled();
    loggerSpy.mockRestore();
  });
});

describe('MoEngage identifyOld tests (without identity resolution)', () => {
  let moEngage: MoEngage;

  beforeEach(() => {
    moEngage = new MoEngage(
      { apiId: 'test-api-id', debug: true, identityResolution: false },
      { logLevel: 'debug', getUserId: () => 'user123' },
    );
    moEngage.init();
    mockMoEngageSDK();
    (moEngage as any).currentUserId = 'user123';
    jest.spyOn(moEngage, 'isLoaded').mockImplementation(() => true);
  });

  test('identify with userId', () => {
    const spy = jest.spyOn((window as any).Moengage, 'add_unique_user_id');
    (moEngage as any).identifyOld({
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      },
    });

    expect(spy).toHaveBeenCalledWith('user123');
  });

  test('identify with traits', () => {
    const emailSpy = jest.spyOn((window as any).Moengage, 'add_email');
    const firstNameSpy = jest.spyOn((window as any).Moengage, 'add_first_name');
    const lastNameSpy = jest.spyOn((window as any).Moengage, 'add_last_name');
    const attributeSpy = jest.spyOn((window as any).Moengage, 'add_user_attribute');

    (moEngage as any).identifyOld({
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            customProperty: 'customValue',
          },
        },
      },
    });

    expect(emailSpy).toHaveBeenCalledWith('test@example.com');
    expect(firstNameSpy).toHaveBeenCalledWith('John');
    expect(lastNameSpy).toHaveBeenCalledWith('Doe');
    expect(attributeSpy).toHaveBeenCalledWith('customProperty', 'customValue');
  });

  test('identify with name trait', () => {
    const nameSpy = jest.spyOn((window as any).Moengage, 'add_user_name');
    (moEngage as any).identifyOld({
      message: {
        userId: 'user123',
        context: {
          traits: {
            name: 'John Doe',
          },
        },
      },
    });

    expect(nameSpy).toHaveBeenCalledWith('John Doe');
  });

  test('identify with different userId should reset session', () => {
    const resetSpy = jest.spyOn(moEngage, 'resetSession');
    (moEngage as any).identifyOld({
      message: {
        userId: 'differentUser',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      },
    });

    expect(resetSpy).toHaveBeenCalled();
  });
});

describe('MoEngage identify tests (with identity resolution)', () => {
  let moEngage: MoEngage;

  beforeEach(() => {
    moEngage = new MoEngage(
      { apiId: 'test-api-id', debug: true, identityResolution: true },
      { logLevel: 'debug', getUserId: () => 'user123' },
    );
    moEngage.init();
    mockMoEngageSDK();
    (moEngage as any).currentUserId = 'user123';
    jest.spyOn(moEngage, 'isLoaded').mockImplementation(() => true);
  });

  test('identify with identity resolution should call identifyUser', async () => {
    const spy = jest.spyOn((window as any).Moengage, 'identifyUser');
    await moEngage.identify({
      message: {
        userId: 'user123',
        anonymousId: 'anon123',
        context: {
          traits: {
            email: 'test@example.com',
            firstName: 'John',
            customKey: 'customValue',
          },
        },
      },
    });

    expect(spy).toHaveBeenCalledWith({
      anonymousId: 'anon123',
      uid: 'user123',
      u_em: 'test@example.com',
      u_fn: 'John',
      customKey: 'customValue',
    });
  });

  test('identify without identity resolution should call identifyOld', async () => {
    (moEngage as any).identityResolution = false;
    const spy = jest.spyOn(moEngage as any, 'identifyOld');

    await moEngage.identify({
      message: {
        userId: 'user123',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      },
    });

    expect(spy).toHaveBeenCalled();
  });

  test('identify with logout scenario should reset session', async () => {
    (moEngage as any).currentUserId = 'user123';
    const resetSpy = jest.spyOn(moEngage, 'resetSession');

    // Test logout scenario (userId is empty but currentUserId exists)
    await moEngage.identify({
      message: {
        userId: '',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      },
    });

    expect(resetSpy).toHaveBeenCalled();
  });

  test('identify with changed userId should reset session', async () => {
    (moEngage as any).currentUserId = 'user123';
    const resetSpy = jest.spyOn(moEngage, 'resetSession');

    await moEngage.identify({
      message: {
        userId: 'differentUser',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      },
    });

    expect(resetSpy).toHaveBeenCalled();
  });

  test('identify with first-time login should set currentUserId', async () => {
    (moEngage as any).currentUserId = '';

    await moEngage.identify({
      message: {
        userId: 'newUser',
        context: {
          traits: {
            email: 'test@example.com',
          },
        },
      },
    });

    expect((moEngage as any).currentUserId).toBe('newUser');
  });
});
