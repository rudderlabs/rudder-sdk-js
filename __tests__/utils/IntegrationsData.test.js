import {
  constructMessageIntegrationsObj,
  getMergedClientSuppliedIntegrations,
} from '../../src/utils/IntegrationsData';

const mockIntegrationsData = {};

const mockIntegrationInstances = [
  {
    name: 'Mock GA4 Integration instance',
    getDataForIntegrationsObject: () => ({
      'Google Analytics 4': {
        sessionId: '1669961395',
      },
    }),
  },
  {
    name: 'Mock AM Integration instance',
  },
];

const expectedEnhancedIntegrationsObject = {
  'Google Analytics 4': {
    sessionId: '1669961395',
  },
};

const mockEnhancedIntegrationsData = {
  'Google Analytics 4': {
    sessionId: '1669961395',
  },
  AM: true,
};

const mockClientSuppliedIntegrations = {
  'Google Analytics 4': true,
};

const expectedMergedClientSuppliedIntegrationsObject = {
  'Google Analytics 4': {
    sessionId: '1669961395',
  },
  AM: true,
};

const mockClientSuppliedIntegrationsWithKeys = {
  'Google Analytics 4': {
    sessionId: '16678456735',
    trackingId: 't-rtcyuTcrw',
  },
};

const expectedMergedClientSuppliedIntegrationsWithKeysObject = {
  'Google Analytics 4': {
    sessionId: '16678456735',
    trackingId: 't-rtcyuTcrw',
  },
  AM: true,
};

const mockClientSuppliedIntegrationsWithInactive = {
  'Google Analytics 4': true,
  AM: false,
};

const expectedMergedClientSuppliedIntegrationsWithInactiveObject = {
  'Google Analytics 4': {
    sessionId: '1669961395',
  },
  AM: false,
};

describe('IntegrationsData utilities', () => {
  it('should construct message integrations object with integrations specific data attached', () => {
    const mergedArray = constructMessageIntegrationsObj(
      mockIntegrationsData,
      mockIntegrationInstances,
    );
    expect(mergedArray).toEqual(expectedEnhancedIntegrationsObject);
  });

  it('should merge data for Client Supplied Integrations', () => {
    const mergedArray = getMergedClientSuppliedIntegrations(
      mockEnhancedIntegrationsData,
      mockClientSuppliedIntegrations,
    );
    expect(mergedArray).toEqual(expectedMergedClientSuppliedIntegrationsObject);
  });

  it('should merge data for Client Supplied Integrations keeping any client defined keys', () => {
    const mergedArray = getMergedClientSuppliedIntegrations(
      mockEnhancedIntegrationsData,
      mockClientSuppliedIntegrationsWithKeys,
    );
    expect(mergedArray).toEqual(expectedMergedClientSuppliedIntegrationsWithKeysObject);
  });

  it('should merge data for Client Supplied Integrations keeping any client inactive integrations', () => {
    const mergedArray = getMergedClientSuppliedIntegrations(
      mockEnhancedIntegrationsData,
      mockClientSuppliedIntegrationsWithInactive,
    );
    expect(mergedArray).toEqual(expectedMergedClientSuppliedIntegrationsWithInactiveObject);
  });
});
