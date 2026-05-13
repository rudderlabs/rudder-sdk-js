import PinterestTag from '../../../src/integrations/PinterestTag/browser';

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const analytics = {
  logLevel: 'debug',
  getUserTraits: () => ({}),
  userTraits: {},
};

const basicConfig = {
  tagId: '123456',
  enhancedMatch: false,
  customProperties: [],
  eventsMapping: [],
  sendAsCustomEvent: false,
};

const defaultContext = { traits: {} };

describe('PinterestTag', () => {
  beforeEach(() => {
    window.pintrk = jest.fn();
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

  describe('event_id deduplication', () => {
    describe('track', () => {
      it.each([
        {
          scenario: 'no deduplicationKey configured',
          config: basicConfig,
          properties: { customId: 'custom-456' },
          expectedEventId: 'msg-track-123',
        },
        {
          scenario: 'custom deduplicationKey resolves',
          config: { ...basicConfig, deduplicationKey: 'properties.customId' },
          properties: { customId: 'custom-456' },
          expectedEventId: 'custom-456',
        },
        {
          scenario: 'deduplicationKey resolves to a falsy value',
          config: { ...basicConfig, deduplicationKey: 'properties.customId' },
          properties: { customId: 0 },
          expectedEventId: 0,
        },
        {
          scenario: 'deduplicationKey path does not resolve',
          config: { ...basicConfig, deduplicationKey: 'properties.nonExistent' },
          properties: {},
          expectedEventId: 'msg-track-123',
        },
      ])('should set event_id correctly when $scenario', ({ config, properties, expectedEventId }) => {
        const pinterestTag = new PinterestTag(config, analytics, destinationInfo);
        pinterestTag.init();

        pinterestTag.track({
          message: {
            event: 'TestEvent',
            messageId: 'msg-track-123',
            context: defaultContext,
            properties,
          },
        });

        const pintrkCall = window.pintrk.mock.calls.find(
          (call) => call[0] === 'track' && call[1] === 'TestEvent',
        );
        expect(pintrkCall).toBeDefined();
        expect(pintrkCall[2].event_id).toBe(expectedEventId);
      });
    });

    describe('page', () => {
      it.each([
        {
          scenario: 'no deduplicationKey configured',
          config: basicConfig,
          message: { name: 'Home', messageId: 'msg-page-123', context: defaultContext },
          expectedEventId: 'msg-page-123',
        },
        {
          scenario: 'custom deduplicationKey resolves',
          config: { ...basicConfig, deduplicationKey: 'properties.customId' },
          message: { name: 'Home', messageId: 'msg-page-123', context: defaultContext, properties: { customId: 'custom-page-789' } },
          expectedEventId: 'custom-page-789',
        },
        {
          scenario: 'deduplicationKey path does not resolve',
          config: { ...basicConfig, deduplicationKey: 'properties.nonExistent' },
          message: { name: 'Home', messageId: 'msg-page-123', context: defaultContext },
          expectedEventId: 'msg-page-123',
        },
      ])('should set event_id correctly when $scenario', ({ config, message, expectedEventId }) => {
        const pinterestTag = new PinterestTag(config, analytics, destinationInfo);
        pinterestTag.init();

        pinterestTag.page({ message });

        const pintrkCall = window.pintrk.mock.calls.find((call) => call[0] === 'track');
        expect(pintrkCall).toBeDefined();
        expect(pintrkCall[2].event_id).toBe(expectedEventId);
      });
    });

    describe('identify', () => {
      const identifyTraits = { email: 'test@example.com' };

      it.each([
        {
          scenario: 'no deduplicationKey configured',
          config: basicConfig,
          expectedEventId: 'msg-identify-123',
        },
        {
          scenario: 'custom deduplicationKey resolves',
          config: { ...basicConfig, deduplicationKey: 'context.traits.email' },
          expectedEventId: 'test@example.com',
        },
      ])('should set event_id correctly when $scenario', ({ config, expectedEventId }) => {
        const pinterestTag = new PinterestTag(config, analytics, destinationInfo);
        pinterestTag.init();

        pinterestTag.identify({
          message: {
            messageId: 'msg-identify-123',
            context: { traits: identifyTraits },
          },
        });

        const setCall = window.pintrk.mock.calls.find(
          (call) => call[0] === 'set' && call[1]?.em === identifyTraits.email,
        );
        expect(setCall).toBeDefined();
        expect(setCall[1].event_id).toBe(expectedEventId);
      });
    });
  });
});
