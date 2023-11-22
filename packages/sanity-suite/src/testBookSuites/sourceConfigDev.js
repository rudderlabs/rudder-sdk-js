import { assertSourceConfigAPI } from './sourceConfig';
import sourceConfig1ExpectedData from '../../__fixtures__/sourceConfigDev1.json';
import sourceConfigDMT1ExpectedData from '../../__fixtures__/sourceConfigDMT1.json';

const sourceConfigAPIDevSuite = {
  id: 'sourceConfig',
  name: 'sourceConfig Endpoint',
  description: 'sourceConfig Endpoint',
  testCases: [
    {
      id: 'sourceConfig1',
      description: 'Call sourceConfig Endpoint',
      inputData: [],
      expectedResult: IS_DMT === true ? sourceConfigDMT1ExpectedData : sourceConfig1ExpectedData,
      triggerHandler: [assertSourceConfigAPI],
    },
  ],
};

export { sourceConfigAPIDevSuite };
