import sourceConfig1ExpectedData from '../../__fixtures__/sourceConfig1.json';

const CONFIG_URL = `CONFIG_SERVER_HOST/sourceConfig/?p=__MODULE_TYPE__&v=__PACKAGE_VERSION__`;

const getConfigUrl = (configUrl, writeKey) => {
  return configUrl
    .concat(configUrl.includes('?') ? '&' : '?')
    .concat(writeKey ? `writeKey=${writeKey}` : '');
};

const getJSONTrimmed = (context, url, writeKey, callback) => {
  const cb_ = callback.bind(context);

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.setRequestHeader('Authorization', `Basic ${btoa(`${writeKey}:`)}`);

  xhr.onload = function () {
    const { status, responseText } = xhr;
    if (status == 200) {
      cb_(200, responseText);
    } else {
      cb_(status);
    }
  };
  xhr.send();
};

const getUserProvidedConfigUrl = (configUrl, defConfigUrl) => {
  let url = configUrl;
  if (url.indexOf('sourceConfig') === -1) {
    url = `${url}/sourceConfig/`;
  }
  url = url.slice(-1) === '/' ? url : `${url}/`;
  const defQueryParams = defConfigUrl.split('?')[1];
  const urlSplitItems = url.split('?');
  if (urlSplitItems.length > 1 && urlSplitItems[1] !== defQueryParams) {
    url = `${urlSplitItems[0]}?${defQueryParams}`;
  } else {
    url = `${url}?${defQueryParams}`;
  }
  return url;
};

const assertSourceConfigAPI = resultCallback => {
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
};

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
      triggerHandler: [assertSourceConfigAPI],
    },
  ],
};

export {
  getConfigUrl,
  getJSONTrimmed,
  getUserProvidedConfigUrl,
  assertSourceConfigAPI,
  sourceConfigAPISuite,
};
