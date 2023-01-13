import { mergeContext } from '../../src/utils/eventProcessorUtils';

describe('Event processor Utilities', () => {
  const rudderElement = {
    message: {
      channel: 'web',
      context: {
        app: {
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '2.22.0',
        },
        traits: {
          firstName: 'Tintin',
          phone: '1234567890',
          email: 'tintin@twentiethcentury.com',
          custom_flavor: 'chocolate',
          custom_date: 1673597638545,
          address: [
            { label: 'office', city: 'Brussels', country: 'Belgium' },
            { label: 'home', city: 'Kolkata', country: 'India' },
          ],
        },
        library: { name: 'RudderLabs JavaScript SDK', version: '2.22.0' },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        device: null,
        network: null,
        os: { name: '', version: '' },
        locale: 'en-GB',
        screen: { density: 2, width: 1440, height: 900, innerWidth: 1440, innerHeight: 253 },
        sessionId: 1673597629454,
        sessionStart: true,
      },
      type: 'identify',
      messageId: '55fc2294-4622-4deb-be84-9c42372b64cd',
      originalTimestamp: '2023-01-13T08:13:58.548Z',
      anonymousId: '50cdaf05-ce75-418c-b666-98b9a9938f9f',
      userId: 'user-id',
      event: null,
      properties: null,
      integrations: { All: true },
      user_properties: null,
    },
  };
  const options = { a: 'moumita', key1: 123456, key2: { fg: 'shgjsh' } };

  const expectedRudderElement = {
    message: {
      channel: 'web',
      context: {
        a: 'moumita',
        key1: 123456,
        key2: { fg: 'shgjsh' },
        app: {
          name: 'RudderLabs JavaScript SDK',
          namespace: 'com.rudderlabs.javascript',
          version: '2.22.0',
        },
        traits: {
          firstName: 'Tintin',
          phone: '1234567890',
          email: 'tintin@twentiethcentury.com',
          custom_flavor: 'chocolate',
          custom_date: 1673597638545,
          address: [
            { label: 'office', city: 'Brussels', country: 'Belgium' },
            { label: 'home', city: 'Kolkata', country: 'India' },
          ],
        },
        library: { name: 'RudderLabs JavaScript SDK', version: '2.22.0' },
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        device: null,
        network: null,
        os: { name: '', version: '' },
        locale: 'en-GB',
        screen: { density: 2, width: 1440, height: 900, innerWidth: 1440, innerHeight: 253 },
        sessionId: 1673597629454,
        sessionStart: true,
      },
      type: 'identify',
      messageId: '55fc2294-4622-4deb-be84-9c42372b64cd',
      originalTimestamp: '2023-01-13T08:13:58.548Z',
      anonymousId: '50cdaf05-ce75-418c-b666-98b9a9938f9f',
      userId: 'user-id',
      event: null,
      properties: null,
      integrations: { All: true },
      user_properties: null,
    },
  };

  it('Should merge the context provided in options with the previous context', () => {
    const mergedRudderMessageContext = mergeContext(rudderElement.message, options);
    expect(mergedRudderMessageContext).toStrictEqual(expectedRudderElement.message.context);
  });
});
