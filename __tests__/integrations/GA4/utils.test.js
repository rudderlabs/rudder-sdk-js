import {getGa4SessionId} from "../../../src/integrations/GA4/utils";
import { Cookie } from '../../../src/utils/storage/cookie';
import { Store } from '../../../src/utils/storage/store';

const mockMeasurementId = '1234567890-0987654321';
const gaCookieName = '_ga_0987654321';
const mockGACookieValue = '0987654321.qwerty.123abc';
const expectedSessionId = '123abc';

jest.mock('../../../src/utils/storage/cookie', () => {
    const originalModule = jest.requireActual('../../../src/utils/storage/cookie');

    return {
        __esModule: true,
        ...originalModule,
        Cookie: {
            ...originalModule.Cookie,
            checkSupportAvailability: jest.fn(),
            get: jest.fn()
        }
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
            get: jest.fn()
        }
    };
});

describe('Integration GA4 utilities', () => {

    it('should get GA4 sessionId from GA4 cookie', () => {
        Cookie.checkSupportAvailability.mockImplementation(() => true );
        Cookie.get.mockImplementation((name) => name === gaCookieName ? mockGACookieValue : undefined );

        const ga4SessionId = getGa4SessionId(mockMeasurementId);
        expect(ga4SessionId).toEqual(expectedSessionId);
    });

    it('should get GA4 sessionId from store', () => {
        Cookie.checkSupportAvailability.mockImplementation(() => true );
        Cookie.get.mockImplementation(() => undefined );
        Store.checkSupportAvailability.mockImplementation(() => true );
        Store.get.mockImplementation((name) => name === gaCookieName ? mockGACookieValue : undefined );

        const ga4SessionId = getGa4SessionId(mockMeasurementId);
        expect(ga4SessionId).toEqual(expectedSessionId);
    });

    it('should get not error if no GA4 sessionId exists', () => {
        Cookie.checkSupportAvailability.mockImplementation(() => true );
        Cookie.get.mockImplementation(() => undefined );
        Store.checkSupportAvailability.mockImplementation(() => true );
        Store.get.mockImplementation(() => undefined );

        const ga4SessionId = getGa4SessionId(mockMeasurementId);
        expect(ga4SessionId).toEqual('');
    });

    it('should get not error if no cookie support exists', () => {
        Cookie.checkSupportAvailability.mockImplementation(() => false );
        Cookie.get.mockImplementation(() => undefined );
        Store.checkSupportAvailability.mockImplementation(() => true );
        Store.get.mockImplementation(() => undefined );

        const ga4SessionId = getGa4SessionId(mockMeasurementId);
        expect(ga4SessionId).toEqual('');
    });

    it('should get not error if no cookie & no localstorage support exists', () => {
        Cookie.checkSupportAvailability.mockImplementation(() => false );
        Cookie.get.mockImplementation(() => undefined );
        Store.checkSupportAvailability.mockImplementation(() => false );
        Store.get.mockImplementation(() => undefined );

        const ga4SessionId = getGa4SessionId(mockMeasurementId);
        expect(ga4SessionId).toEqual('');
    });
});