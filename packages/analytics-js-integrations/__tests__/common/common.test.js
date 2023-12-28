import fs from 'fs';
import path from 'path';

const getFolders = (dirPath) => fs.readdirSync(dirPath, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)

const integrationsPath = path.join(__dirname, '../../src/integrations');
const integrations = getFolders(integrationsPath);

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
describe('Destination generic tests', () => {
  it('Verify all integrations names', () => {
    integrations.forEach(async (integrationName) => {
      const IntegrationsClass = await import(`../../src/integrations/${integrationName}/browser`);
      const { NAME: expectedIntegrationName } = await import(`@rudderstack/analytics-js-common/constants/integrations/${integrationName}/constants`);
      const Class = IntegrationsClass.default;
      const integration = new Class(
        {},
        { loglevel: 'debug', loadIntegration: true },
        destinationInfo,
      );
      expect(integration.name).toBe(expectedIntegrationName);
    });
  });
});
