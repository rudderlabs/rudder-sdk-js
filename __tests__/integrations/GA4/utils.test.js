import { getGa4SessionIdAndClientId } from '../../../src/integrations/GA4/utils';
import { Cookie } from '../../../src/utils/storage/cookie';
import { Store } from '../../../src/utils/storage/store';

const mockMeasurementId = '1234567890-0987654321';
const gaCookieName = '_ga_0987654321';
const mockGACookieSessionIdValue = '0987654321.qwerty.123abc';
const mockGACookieClientIdValue = 'GA1.1.476718111.1670251144';
const expectedSessionId = '123abc';
const expectedClientId = '476718111.1670251144';

jest.mock('../../../src/utils/storage/cookie', () => {
  const originalModule = jest.requireActual('../../../src/utils/storage/cookie');

  return {
    __esModule: true,
    ...originalModule,
    Cookie: {
      ...originalModule.Cookie,
      checkSupportAvailability: jest.fn(),
      get: jest.fn(),
    },
  };
});

jest.mock('../../../src/utils/storage/store', () => {
  const originalModule = jest.requireActual('../../../src/utils/storage/store');

  return {
    __esModule: true,
    ...originalModule,
    Store: {
      ...originalModule.Store,
      checkSupportAvailability: jest.fn(),
      get: jest.fn(),
    },
  };
});

describe('Integration GA4 utilities', () => {
  it('should get GA4 sessionId and clientId from GA4 cookie', () => {
    Cookie.checkSupportAvailability.mockImplementation(() => true);
    Cookie.get.mockImplementation((name) => {
      if (name === gaCookieName) {
        return mockGACookieSessionIdValue;
      }
      if (name === '_ga') {
        return mockGACookieClientIdValue;
      }
      return undefined;
    });

    const { sessionId, clientId } = getGa4SessionIdAndClientId(mockMeasurementId);
    expect(sessionId).toEqual(expectedSessionId);
    expect(clientId).toEqual(expectedClientId);
  });

  it('should get GA4 sessionId and clientId from store', () => {
    Cookie.checkSupportAvailability.mockImplementation(() => true);
    Cookie.get.mockImplementation(() => undefined);
    Store.checkSupportAvailability.mockImplementation(() => true);
    Store.get.mockImplementation((name) => {
      if (name === gaCookieName) {
        return mockGACookieSessionIdValue;
      }
      if (name === '_ga') {
        return mockGACookieClientIdValue;
      }
      return undefined;
    });

    const { sessionId, clientId } = getGa4SessionIdAndClientId(mockMeasurementId);
    expect(sessionId).toEqual(expectedSessionId);
    expect(clientId).toEqual(expectedClientId);
  });

  it('should get not error if no GA4 sessionId and clientId exists', () => {
    Cookie.checkSupportAvailability.mockImplementation(() => true);
    Cookie.get.mockImplementation(() => undefined);
    Store.checkSupportAvailability.mockImplementation(() => true);
    Store.get.mockImplementation(() => undefined);

    const { sessionId, clientId } = getGa4SessionIdAndClientId(mockMeasurementId);
    expect(sessionId).toEqual('');
    expect(clientId).toEqual('');
  });

  it('should get not error if no cookie support exists', () => {
    Cookie.checkSupportAvailability.mockImplementation(() => false);
    Cookie.get.mockImplementation(() => undefined);
    Store.checkSupportAvailability.mockImplementation(() => true);
    Store.get.mockImplementation(() => undefined);

    const { sessionId, clientId } = getGa4SessionIdAndClientId(mockMeasurementId);
    expect(sessionId).toEqual('');
    expect(clientId).toEqual('');
  });

  it('should get not error if no cookie & no localstorage support exists', () => {
    Cookie.checkSupportAvailability.mockImplementation(() => false);
    Cookie.get.mockImplementation(() => undefined);
    Store.checkSupportAvailability.mockImplementation(() => false);
    Store.get.mockImplementation(() => undefined);

    const { sessionId, clientId } = getGa4SessionIdAndClientId(mockMeasurementId);
    expect(sessionId).toEqual('');
    expect(clientId).toEqual('');
  });
});
