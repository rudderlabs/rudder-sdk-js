import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const BaseIntegrationDir = join(__dirname, '../../../src/constants/integrations');
describe('Integration Constants', () => {
  let allConstants: Record<string, string>;

  beforeAll(async () => {
    allConstants = await import(join(BaseIntegrationDir, 'Destinations'));
  });

  const integrations = readdirSync(BaseIntegrationDir);
  integrations
    // Skip non integration folders
    .filter(dir => ['CommonIntegrationsConstant'].indexOf(dir) === -1)
    .filter(dir => statSync(join(BaseIntegrationDir, dir)).isDirectory())
    .forEach(integration => {
      describe(`${integration} Integration`, () => {
        let integrationConstants: { NAME: string; DISPLAY_NAME: string };

        beforeAll(async () => {
          const modulePath = join(BaseIntegrationDir, integration, 'constants');
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
