/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-underscore-dangle */
import SnapPixel from '../../../src/integrations/SnapPixel/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

describe('SnapPixel', () => {
  beforeEach(() => {
    window.snaptr = jest.fn();
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.id = 'dummyScript';
    const headElements = document.getElementsByTagName('head');
    headElements[0].insertBefore(scriptElement, headElements[0].firstChild);
  });

  afterEach(() => {
    jest.clearAllMocks();
    const dummyScript = document.getElementById('dummyScript');
    if (dummyScript) {
      dummyScript.remove();
    }
  });

  describe('identify', () => {
    it('should identify user with only required parameters', () => {
      const destinationConfig = {
        pixelId: '12345',
        deduplicationKey: 'email',
        hashMethod: false,
        enableDeduplication: false,
        eventMappingFromConfig: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      // Only providing email, without optional parameters
      const rudderElement = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
            },
          },
        },
      };

      const snapPixel = new SnapPixel(destinationConfig, analytics, destinationInfo);
      snapPixel.init();
      snapPixel.identify(rudderElement);

      // Verify that only email is in the payload
      expect(window.snaptr.mock.calls[1]).toEqual([
        'init',
        '12345',
        {
          user_email: 'test@example.com',
        },
      ]);
    });

    it('should identify user with all available parameters', () => {
      const destinationConfig = {
        pixelId: '12345',
        deduplicationKey: 'email',
        hashMethod: false,
        enableDeduplication: false,
        eventMappingFromConfig: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const rudderElement = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
              phone: '+1234567890',
              firstName: 'John',
              lastName: 'Doe',
              age: 30,
              city: 'San Francisco',
              state: 'CA',
              postalCode: '94105',
              country: 'USA',
            },
            ip: '192.168.1.1',
          },
        },
      };

      const snapPixel = new SnapPixel(destinationConfig, analytics, destinationInfo);
      snapPixel.init();
      snapPixel.identify(rudderElement);

      // Verify all parameters are included
      expect(window.snaptr.mock.calls[1]).toEqual([
        'init',
        '12345',
        {
          user_email: 'test@example.com',
          user_phone_number: '+1234567890',
          ip_address: '192.168.1.1',
          firstname: 'John',
          lastname: 'Doe',
          age: 30,
          geo_city: 'San Francisco',
          geo_region: 'CA',
          geo_postal_code: '94105',
          geo_country: 'USA',
        },
      ]);
    });

    it('should identify user with partial parameters', () => {
      const destinationConfig = {
        pixelId: '12345',
        deduplicationKey: 'email',
        hashMethod: false,
        enableDeduplication: false,
        eventMappingFromConfig: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      // Providing only some optional parameters
      const rudderElement = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
              firstName: 'John',
              city: 'San Francisco',
            },
          },
        },
      };

      const snapPixel = new SnapPixel(destinationConfig, analytics, destinationInfo);
      snapPixel.init();
      snapPixel.identify(rudderElement);

      // Verify only provided parameters are included
      expect(window.snaptr.mock.calls[1]).toEqual([
        'init',
        '12345',
        {
          user_email: 'test@example.com',
          firstname: 'John',
          geo_city: 'San Francisco',
        },
      ]);
    });

    it('should skip age if in object format', () => {
      const destinationConfig = {
        pixelId: '12345',
        deduplicationKey: 'email',
        hashMethod: true,
        enableDeduplication: false,
        eventMappingFromConfig: false,
      };

      const analytics = {
        logLevel: 'debug',
        getAnonymousId: () => 'ANONYMOUS_ID',
      };

      const rudderElement = {
        message: {
          context: {
            traits: {
              email: 'test@example.com',
              firstName: 'John',
              city: 'San Francisco',
              age: {
                a: 1,
              },
            },
          },
        },
      };

      const snapPixel = new SnapPixel(destinationConfig, analytics, destinationInfo);
      snapPixel.init();
      snapPixel.identify(rudderElement);

      expect(window.snaptr.mock.calls[1]).toEqual([
        'init',
        '12345',
        {
          user_email: 'test@example.com',
          firstname: 'John',
          geo_city: 'San Francisco',
        },
      ]);
    });
  });
});
