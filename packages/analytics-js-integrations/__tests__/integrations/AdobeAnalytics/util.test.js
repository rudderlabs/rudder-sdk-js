import {
  getDataFromContext,
  handleLists,
  setConfig,
  mapMerchProductEvents,
} from '../../../src/integrations/AdobeAnalytics/util';

let windowSpy;
beforeEach(() => {
  windowSpy = jest.spyOn(window, 'window', 'get');
});

afterEach(() => {
  windowSpy.mockRestore();
});
describe('AdobeAnalytics Utility functions tests', () => {
  describe('getDataFromContext Tests', () => {
    it('should return an empty object when contextMap is empty', () => {
      const contextMap = {};
      const rudderElement = { message: {} };
      const result = getDataFromContext(contextMap, rudderElement);
      expect(result).toEqual({});
    });
    it('should return an object with values mapped from context and properties of rudder message', () => {
      const contextMap = {
        'page.name': 'pName',
        'page.url': 'pUrl',
        'page.arr.0.name': 'p0Name',
      };
      const rudderElement = {
        message: {
          context: {
            page: {
              name: 'Home Page',
              url: 'https://example.com',
              arr: [{ name: 'arrName' }],
            },
            path: '/page1',
          },
          properties: {
            property1: 'value1',
            property2: 'value2',
          },
        },
      };
      const result = getDataFromContext(contextMap, rudderElement);
      expect(result).toEqual({
        pName: 'Home Page',
        pUrl: 'https://example.com',
        p0Name: 'arrName',
      });
    });
    it('should map values from top level properties of rudder message to keys specified in contextMap', () => {
      const contextMap = { anonymousId: 'aId', userId: 'uId' };
      const rudderElement = {
        message: {
          anonymousId: '12345',
          userId: '67890',
          properties: {
            property1: 'value1',
            property2: 'value2',
            userId: '67890',
          },
        },
      };
      const result = getDataFromContext(contextMap, rudderElement);
      expect(result).toEqual({
        aId: '12345',
        uId: '67890',
      });
    });
  });
  describe('handleLists Tests', () => {
    // Sets list variable of window.s with correct delimiter and list name
    it('should set list variable of window.s with correct delimiter and list name when mapping and delimiter are present', () => {
      const rudderElement = {
        message: {
          properties: {
            key1: 'value1',
            key2: 'value2',
          },
        },
      };
      windowSpy.mockImplementation(() => ({
        s: { list1: 'value1', list2: 'value2' },
      }));
      const config = {
        listMapping: [
          { from: 'key1', to: 'list1', delimiter: ',' },
          { from: 'key2', to: 'list2', delimiter: ';' },
        ],
      };
      setConfig(config);
      handleLists(rudderElement);

      expect(window.s.list1).toBe('value1');
      expect(window.s.list2).toBe('value2');
    });
    // Skips list variable update if mapping or delimiter is missing
    it('should skip list variable update if mapping or delimiter is missing', () => {
      const rudderElement = {
        message: {
          properties: {
            key1: 'value1',
            key2: 'value2',
          },
        },
      };
      windowSpy.mockImplementation(() => ({
        s: { list1: 'value1', list2: undefined },
      }));
      const config = {
        listMapping: [
          { from: 'key1', to: 'list1', delimiter: ',' },
          { from: 'key3', to: 'list3', delimiter: ';' },
        ],
      };
      setConfig(config);

      handleLists(rudderElement);

      expect(window.s.list1).toBe('value1');
      expect(window.s.list2).toBeUndefined();
    });
  });
  describe('mapMerchProductEvents', () => {
    // Should return an empty array when productMerchEventToAdobeEventHashmap does not contain the event
    it('should return an empty array when productMerchEventToAdobeEventHashmap does not contain the event', () => {
      const event = 'testEvent';
      const properties = {
        currencyProdMerch: 'someRandomData',
        prodLevelCurrency: 'some RandomCurrency',
      };
      const adobeEvent = 'testAdobeEvent';
      const config = {
        productMerchEventToAdobeEvent: [
          { from: 'key1', to: 'list1', delimiter: ',' },
          { from: 'testEvent', to: 'Test Adobe Event', delimiter: ';' },
        ],
        productMerchProperties: [
          {
            productMerchProperties: 'currencyProdMerch',
          },
          {
            productMerchProperties: 'addressProdMerch',
          },
          {
            productMerchProperties: 'products.prodLevelCurrency',
          },
        ],
        productIdentifier: 'id',
      };
      setConfig(config);
      const result = mapMerchProductEvents(event, properties, adobeEvent);

      expect(result).toEqual([
        'testAdobeEvent=someRandomData',
        'testAdobeEvent=some RandomCurrency',
      ]);
    });
    // Should handle gracefully when productMerchProperties is undefined
    it('should handle gracefully when productMerchProperties is undefined', () => {
      const event = 'testEvent';
      const properties = {};
      const adobeEvent = 'testAdobeEvent';
      const config = {
        productMerchEventToAdobeEvent: {
          testevent: 'testadobeevent',
        },
        productMerchProperties: undefined,
        productIdentifier: 'id',
      };
      setConfig(config);
      const result = mapMerchProductEvents(event, properties, adobeEvent);

      expect(result).toEqual([]);
    });
  });
});
