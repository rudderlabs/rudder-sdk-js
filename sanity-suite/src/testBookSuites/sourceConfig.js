import sourceConfig1ExpectedData from '../../__mocks__/sourceConfig1.json';
import { getConfigUrl, getJSONTrimmed, getUserProvidedConfigUrl } from '../../../src/utils/utils';

const sourceConfigAPISuite = {
  id: 'sourceConfig',
  name: 'sourceConfig Endpoint',
  description: 'sourceConfig Endpoint',
  testCases: [
    {
      id: 'sourceConfig1',
      description: 'Call sourceConfig Endpoint',
      inputData: [],
      expectedResult: sourceConfig1ExpectedData,
      triggerHandler: [
        (resultCallback) => {
          const processResult = (status, apiResponse) => {
            try {
              const data = JSON.parse(apiResponse);
              resultCallback(data, true);
            } catch (error) {
              resultCallback({}, true);
            }
          };
          let configUrl = getConfigUrl(window.userWriteKey);

          if (window.userConfigUrl) {
            configUrl = getUserProvidedConfigUrl(window.userConfigUrl, configUrl);
          }

          try {
            getJSONTrimmed(this, configUrl, window.userWriteKey, processResult);
          } catch (error) {
            processResult(500, {});
          }
        },
      ],
    },
  ],
};

export { sourceConfigAPISuite };
