import { getConfigUrl, getJSONTrimmed, getUserProvidedConfigUrl } from './sourceConfig';
import sourceConfig1ExpectedData from '../../__fixtures__/sourceConfigDev1.json';

const CONFIG_URL =
  'https://api.dev.rudderlabs.com/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__';

const sourceConfigAPIDevSuite = {
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
        resultCallback => {
          const processResult = (status, apiResponse) => {
            try {
              const data = JSON.parse(apiResponse);
              resultCallback(data, true);
            } catch (error) {
              resultCallback({}, true);
            }
          };
          let configUrl = getConfigUrl(CONFIG_URL, window.userWriteKey);

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

export { sourceConfigAPIDevSuite };
