import fs from 'fs';
import path from 'path';

const getFolders = dirPath =>
  fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);

const integrationsPath = path.join(__dirname, '../../src/integrations');
const integrations = getFolders(integrationsPath);

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
describe('Destination generic tests', () => {
  it('Verify all integrations names', () => {
    integrations.forEach(async integrationName => {
      const IntegrationsClass = await import(`../../src/integrations/${integrationName}/browser`);
      const { NAME: expectedIntegrationName } = await import(
        `../../src/integrations/${integrationName}/constants`
      );
      const Class = IntegrationsClass.default;
      const integration = new Class(
        {},
        { loglevel: 'debug', loadIntegration: true },
        destinationInfo,
      );
      expect(integration.name).toBe(expectedIntegrationName);
    });
  });

  it('Verify all integrations export is done correctly and all integration contains init, isReady and isLoaded method', () => {
    integrations.forEach(async integrationName => {
      const IntegrationsClass = await import(`../../src/integrations/${integrationName}/browser`);
      const Class = IntegrationsClass.default;
      const integration = new Class(
        {},
        { loglevel: 'debug', loadIntegration: true },
        destinationInfo,
      );

      expect(typeof IntegrationsClass).toBe('object');
      expect(integration.init).toBeDefined();
      expect(integration.isReady).toBeDefined();
      expect(integration.isLoaded).toBeDefined();
      expect(typeof integration.init).toBe('function');
      expect(typeof integration.isReady).toBe('function');
      expect(typeof integration.isLoaded).toBe('function');
    });
  });
});
