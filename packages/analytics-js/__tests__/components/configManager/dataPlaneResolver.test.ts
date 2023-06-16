import { resolveDataPlaneUrl } from '@rudderstack/analytics-js/components/configManager/util/dataPlaneResolver';
import { RegionDetails, ResidencyServerRegion } from '@rudderstack/analytics-js/state/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
    },
  };
});

const usDataplaneUrl = 'https://sample.rudderlabs.com/us';
const euDataplaneUrl = 'https://sample.rudderlabs.com/eu';
const serverUrl = 'https://sample.rudderlabs.com';

const sourceConfigWithBothDataPlane: Record<ResidencyServerRegion, RegionDetails[]> = {
  US: [
    {
      url: usDataplaneUrl,
      default: true,
    },
  ],
  EU: [
    {
      url: euDataplaneUrl,
      default: true,
    },
  ],
};

const sourceConfigWithUSDataPlane: Record<ResidencyServerRegion, RegionDetails[]> = {
  US: [
    {
      url: usDataplaneUrl,
      default: true,
    },
  ],
};

const sourceConfigWithEUDataPlane: Record<ResidencyServerRegion, RegionDetails[]> = {
  EU: [
    {
      url: euDataplaneUrl,
      default: true,
    },
  ],
};
const sourceConfigWithEmptyDataPlanes = undefined;

const validResidencyServerUS = ResidencyServerRegion.US;
const validResidencyServerEU = ResidencyServerRegion.EU;

const testCaseData = [
  {
    description:
      'When dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl,
    },
    output: serverUrl,
  },
  {
    description: 'When dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl,
    },
    output: usDataplaneUrl,
  },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl,
      options: validResidencyServerUS,
    },
    output: serverUrl,
  },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl,
      options: validResidencyServerUS,
    },
    output: usDataplaneUrl,
  },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is provided but US region not available in source config then load API dataplane Url will be selected',
    input: {
      response: sourceConfigWithEUDataPlane,
      serverUrl,
      options: validResidencyServerUS,
    },
    output: serverUrl,
  },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl,
      options: validResidencyServerEU,
    },
    output: serverUrl,
  },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl,
      options: validResidencyServerEU,
    },
    output: euDataplaneUrl,
  },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is provided only for US region not available in source config then US region dataplane Url will be selected',
    input: {
      response: sourceConfigWithUSDataPlane,
      serverUrl,
      options: validResidencyServerEU,
    },
    output: usDataplaneUrl,
  },
];

const testCaseDataWithInvalidDataplaneUrl = [
  {
    description:
      'When dataplane is not provided in source config or in load API, default dataplane Url will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl: undefined,
    },
  },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is not provided in source config or in load API, default dataplane Url will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      options: validResidencyServerUS,
    },
  },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is not provided in source config or in load API, default dataplane Url will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      options: validResidencyServerEU,
    },
  },
];

test.each(testCaseData)('$description', ({ input, output }) => {
  const url = resolveDataPlaneUrl(input.response, input.serverUrl, input.options);
  expect(url).toEqual(output);
});

test.each(testCaseDataWithInvalidDataplaneUrl)('$description', ({ input }) => {
  resolveDataPlaneUrl(input.response, input.serverUrl, input.options, defaultLogger);
  expect(defaultLogger.error).toHaveBeenCalledWith(
    'Unable to load the SDK due to invalid data plane URL',
  );
});
