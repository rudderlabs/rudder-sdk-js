import { sendUserIdToGA4 } from '../../../src/integrations/GA4/utils';

describe('Google Analytics 4 utilities sendUserIdToGA4 function tests', () => {
    test('Default integrationsObj', () => {
        const sendUserId = sendUserIdToGA4({ All: true });
        expect(sendUserId).toEqual(true);
    });

    test('IntegrationsObj with GA4 and without sendUserId property', () => {
        const sendUserId = sendUserIdToGA4({ All: true, GA4: { sessionId: '1782034567' } });
        expect(sendUserId).toEqual(true);
    });

    test('IntegrationsObj with GA4 and sendUserId set to true', () => {
        const sendUserId = sendUserIdToGA4({
            All: true,
            GA4: { sessionId: '1782034567', sendUserId: true },
        });
        expect(sendUserId).toEqual(true);
    });

    test('IntegrationsObj with GA4 and sendUserId set to false', () => {
        const sendUserId = sendUserIdToGA4({
            All: true,
            GA4: { sessionId: '1782034567', sendUserId: false },
        });
        expect(sendUserId).toEqual(false);
    });
});