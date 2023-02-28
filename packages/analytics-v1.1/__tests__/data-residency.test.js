import { resolveDataPlaneUrl } from '../src/utils/utils';

const usDataplaneUrl = 'https://sample.rudderlabs.com/us';
const euDataplaneUrl = 'https://sample.rudderlabs.com/eu';
const serverUrl = 'https://sample.rudderlabs.com';

const sourceConfigWithBothDataPlane = {
  source: {
    dataplanes: {
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
    },
  },
};

const sourceConfigWithUSDataPlane = {
  source: {
    dataplanes: {
      US: [
        {
          url: usDataplaneUrl,
          default: true,
        },
      ],
    },
  },
};

const sourceConfigWithEUDataPlane = {
  source: {
    dataplanes: {
      EU: [
        {
          url: euDataplaneUrl,
          default: true,
        },
      ],
    },
  },
};
const sourceConfigWithEmptyDataPlanes = { source: {} };

const invalidResidencyServer1 = { residencyServer: 1234 };
const invalidResidencyServer2 = { residencyServer: 'test' };
const validResidencyServerUS = { residencyServer: 'US' };
const validResidencyServerEU = { residencyServer: 'EU' };

const testCaseData = [
  // {
  //   description:
  //     'When dataplane is not provided in source config or in load API, default dataplane Url will be selected',
  //   input: {
  //     response: sourceConfigWithEmptyDataPlanes,
  //   },
  //   output: DEFAULT_DATAPLANE_URL,
  // },
  {
    description:
      'When dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl: serverUrl,
    },
    output: serverUrl,
  },
  {
    description: 'When dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl: serverUrl,
    },
    output: usDataplaneUrl,
  },
  // {
  //   description:
  //     'In case of invalid residencyServer option: dataplane is not provided in source config or in load API, default dataplane Url will be selected',
  //   input: {
  //     response: sourceConfigWithEmptyDataPlanes,
  //     options: invalidResidencyServer1,
  //   },
  //   output: DEFAULT_DATAPLANE_URL,
  // },
  {
    description:
      'In case of invalid residencyServer option: dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl: serverUrl,
      options: invalidResidencyServer2,
    },
    output: serverUrl,
  },
  {
    description:
      'In case of invalid residencyServer option: dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl: serverUrl,
      options: invalidResidencyServer1,
    },
    output: usDataplaneUrl,
  },
  // {
  //   description:
  //     'In case of valid residencyServer(US) option: dataplane is not provided in source config or in load API, default dataplane Url will be selected',
  //   input: {
  //     response: sourceConfigWithEmptyDataPlanes,
  //     options: validResidencyServerUS,
  //   },
  //   output: DEFAULT_DATAPLANE_URL,
  // },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl: serverUrl,
      options: validResidencyServerUS,
    },
    output: serverUrl,
  },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl: serverUrl,
      options: validResidencyServerUS,
    },
    output: usDataplaneUrl,
  },
  {
    description:
      'In case of valid residencyServer(US) option: dataplane is provided but US region not available in source config then load API dataplane Url will be selected',
    input: {
      response: sourceConfigWithEUDataPlane,
      serverUrl: serverUrl,
      options: validResidencyServerUS,
    },
    output: serverUrl,
  },
  // {
  //   description:
  //     'In case of valid residencyServer(EU) option: dataplane is not provided in source config or in load API, default dataplane Url will be selected',
  //   input: {
  //     response: sourceConfigWithEmptyDataPlanes,
  //     options: validResidencyServerEU,
  //   },
  //   output: DEFAULT_DATAPLANE_URL,
  // },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is not provided in source config but provided in load API, dataplane Url from load option will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      serverUrl: serverUrl,
      options: validResidencyServerEU,
    },
    output: serverUrl,
  },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is provided in source config that dataplane Url will be selected',
    input: {
      response: sourceConfigWithBothDataPlane,
      serverUrl: serverUrl,
      options: validResidencyServerEU,
    },
    output: euDataplaneUrl,
  },
  {
    description:
      'In case of valid residencyServer(EU) option: dataplane is provided only for US region not available in source config then US region dataplane Url will be selected',
    input: {
      response: sourceConfigWithUSDataPlane,
      serverUrl: serverUrl,
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
      serverUrl: null,
    },
  },
  {
    description:
      'In case of invalid residencyServer option: dataplane is not provided in source config or in load API, default dataplane Url will be selected',
    input: {
      response: sourceConfigWithEmptyDataPlanes,
      options: invalidResidencyServer1,
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
  const url = () => resolveDataPlaneUrl(input.response, input.serverUrl, input.options);
  expect(url).toThrow('Unable to load the SDK due to invalid data plane url');
});
