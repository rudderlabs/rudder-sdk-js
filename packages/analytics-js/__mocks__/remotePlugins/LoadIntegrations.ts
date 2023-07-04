import { ExternalSrcLoader } from 'packages/common/src/services/ExternalSrcLoader';

const LoadIntegrations = () => ({
  name: 'loadIntegrationsTest',
  remote: {
    test: jest.fn(() => {}),
    load_integrations: jest.fn(
      (
        clientIntegrations: any[],
        state: any,
        externalSrcLoader: ExternalSrcLoader,
        externalScriptOnLoad: (id?: string) => unknown,
      ) => {},
    ),
  },
});

export default LoadIntegrations;
