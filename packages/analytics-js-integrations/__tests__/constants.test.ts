import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const BaseDir = join(__dirname, '../src');

describe('Integration Constants', () => {
  let allConstants: Record<string, string>;

  beforeAll(async () => {
    allConstants = await import(join(BaseDir, 'constants/Destinations'));
  });

  const baseIntegrationDir = join(BaseDir, 'integrations');
  const integrations = readdirSync(baseIntegrationDir);
  integrations
    // Skip non integration folders
    .filter(dir => statSync(join(baseIntegrationDir, dir)).isDirectory())
    .forEach(integration => {
      describe(`${integration} Integration`, () => {
        let integrationConstants: {
          NAME: string;
          DISPLAY_NAME: string;
          VENDOR_SDK_PINNED_URL?: string;
          VENDOR_SDK_INTEGRITY?: string;
          VENDOR_SDK_FLOATING_URL?: string;
        };

        beforeAll(async () => {
          const modulePath = join(baseIntegrationDir, integration, 'constants');
          integrationConstants = await import(modulePath);
        });

        it('pinned artifacts require full instance support and valid pins', async () => {
          const { VENDOR_SDK_PINNED_URL, VENDOR_SDK_INTEGRITY, VENDOR_SDK_FLOATING_URL } =
            integrationConstants;
          if (
            'VENDOR_SDK_PINNED_URL' in integrationConstants ||
            'VENDOR_SDK_INTEGRITY' in integrationConstants
          ) {
            const { default: Integration } = await import(
              join(baseIntegrationDir, integration, 'browser')
            );
            expect(new Integration({}, {}).getVendorSdkPinSupport()).toBe('full');
            expect(VENDOR_SDK_PINNED_URL).not.toBe(VENDOR_SDK_FLOATING_URL);
            expect(new URL(VENDOR_SDK_PINNED_URL!).pathname).toMatch(
              /(?:^|[/@-])v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?=$|[/.-])/,
            );
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
