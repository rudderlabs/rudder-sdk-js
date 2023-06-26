import { sendUserId } from '../../../src/integrations/GA4/utils';

describe('Google Analytics 4 utilities sendUserIdToGA4 function tests', () => {
  test('Default integrationsObj', () => {
    const sendUserIdToGA4 = sendUserId({ All: true });
    expect(sendUserIdToGA4).toEqual(true);
  });

  test('IntegrationsObj with GA4 and without sendUserId property', () => {
    const sendUserIdToGA4 = sendUserId({ All: true, GA4: { sessionId: '1782034567' } });
    expect(sendUserIdToGA4).toEqual(true);
  });

  test('IntegrationsObj with GA4 and sendUserId set to true', () => {
    const sendUserIdToGA4 = sendUserId({
      All: true,
      GA4: { sessionId: '1782034567', sendUserId: true },
    });
    expect(sendUserIdToGA4).toEqual(true);
  });

  test('IntegrationsObj with GA4 and sendUserId set to false', () => {
    const sendUserIdToGA4 = sendUserId({
      All: true,
      GA4: { sessionId: '1782034567', sendUserId: false },
    });
    expect(sendUserIdToGA4).toEqual(false);
  });
});
