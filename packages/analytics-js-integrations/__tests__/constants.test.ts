import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const UNDECLARED_PIN_SUPPORT_BASELINE: readonly string[] = [
  'ActiveCampaign',
  'AdobeAnalytics',
  'Adroll',
  'Appcues',
  'Axeptio',
  'BingAds',
  'Braze',
  'Chartbeat',
  'Clevertap',
  'CommandBar',
  'Comscore',
  'ConvertFlow',
  'Criteo',
  'CustomerIO',
  'DCMFloodlight',
  'Drip',
  'Engage',
  'FacebookPixel',
  'Fullstory',
  'GA',
  'GA360',
  'GA4',
  'GA4_V2',
  'Gainsight_PX',
  'GoogleAds',
  'GoogleOptimize',
  'GoogleTagManager',
  'Heap',
  'Hotjar',
  'HubSpot',
  'INTERCOM',
  'June',
  'Kissmetrics',
  'Klaviyo',
  'Lemnisk',
  'LinkedInInsightTag',
  'LiveChat',
  'Lytics',
  'Matomo',
  'MicrosoftClarity',
  'Mixpanel',
  'MoEngage',
  'Mouseflow',
  'Olark',
  'OpenAIAds',
  'Pendo',
  'PinterestTag',
  'Podsights',
  'PostAffiliatePro',
  'Posthog',
  'ProfitWell',
  'Qualaroo',
  'Qualtrics',
  'QuantumMetric',
  'QuoraPixel',
  'RedditPixel',
  'Refiner',
  'Rockerbox',
  'RollBar',
  'Satismeter',
  'Sendinblue',
  'SnapEngage',
  'SnapPixel',
  'SpotifyPixel',
  'Sprig',
  'TVSquared',
  'TiktokAds',
  'Userpilot',
  'VWO',
  'Vero',
  'Woopra',
  'XPixel',
  'YandexMetrica',
];
const EXISTING_SRI_LOADERS = ['Amplitude', 'Sentry'];

const BaseDir = join(__dirname, '../src');

describe('Integration Constants', () => {
  let allConstants: Record<string, string>;

  beforeAll(async () => {
    allConstants = await import(join(BaseDir, 'constants/Destinations'));
  });

  const baseIntegrationDir = join(BaseDir, 'integrations');
  const integrations = readdirSync(baseIntegrationDir);
  it('baseline lists only undeclared integrations', async () => {
    for (const integration of UNDECLARED_PIN_SUPPORT_BASELINE) {
      expect(statSync(join(baseIntegrationDir, integration)).isDirectory()).toBe(true);
      const constants = await import(join(baseIntegrationDir, integration, 'constants'));
      expect(constants.VENDOR_SDK_PIN_SUPPORT).toBeUndefined();
    }
  });

  integrations
    // Skip non integration folders
    .filter(dir => statSync(join(baseIntegrationDir, dir)).isDirectory())
    .forEach(integration => {
      describe(`${integration} Integration`, () => {
        let integrationConstants: {
          NAME: string;
          DISPLAY_NAME: string;
          VENDOR_SDK_PIN_SUPPORT?: string;
          VENDOR_SDK_PINNED_URL?: string;
          VENDOR_SDK_INTEGRITY?: string;
          VENDOR_SDK_FLOATING_URL?: string;
        };

        beforeAll(async () => {
          const modulePath = join(baseIntegrationDir, integration, 'constants');
          integrationConstants = await import(modulePath);
        });

        it('declares vendor pin support unless baselined', () => {
          if (!UNDECLARED_PIN_SUPPORT_BASELINE.includes(integration)) {
            expect(['full', 'none', 'no-script']).toContain(
              integrationConstants.VENDOR_SDK_PIN_SUPPORT,
            );
          }
        });

        it('full declarations carry a valid same-host pin', () => {
          const {
            VENDOR_SDK_PIN_SUPPORT,
            VENDOR_SDK_PINNED_URL,
            VENDOR_SDK_INTEGRITY,
            VENDOR_SDK_FLOATING_URL,
          } = integrationConstants;
          if (VENDOR_SDK_PIN_SUPPORT === 'full' && !EXISTING_SRI_LOADERS.includes(integration)) {
            expect(new URL(VENDOR_SDK_PINNED_URL!).protocol).toBe('https:');
            expect(VENDOR_SDK_INTEGRITY).toMatch(/^sha384-[A-Za-z0-9+/]{64}$/);
            expect(new URL(VENDOR_SDK_PINNED_URL!).hostname).toBe(
              new URL(VENDOR_SDK_FLOATING_URL!).hostname,
            );
          }
        });

        it('should have the same NAME as defined in Destination constants', () => {
          const { NAME } = integrationConstants;
          expect(NAME).toBeDefined();
          expect(NAME).toEqual(allConstants[`${NAME}_NAME`]);
        });

        it('should have the same DISPLAY_NAME as defined in Destination constants', () => {
          const { NAME, DISPLAY_NAME } = integrationConstants;
          expect(DISPLAY_NAME).toBeDefined();
          expect(DISPLAY_NAME).toEqual(allConstants[`${NAME}_DISPLAY_NAME`]);
        });
      });
    });
});
