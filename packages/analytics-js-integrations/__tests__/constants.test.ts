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
        let integrationConstants: { NAME: string; DISPLAY_NAME: string };

        beforeAll(async () => {
          const modulePath = join(baseIntegrationDir, integration, 'constants');
          integrationConstants = await import(modulePath);
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
