import { resolveDataPlaneUrl } from '../utils/utils';
import { DEFAULT_DATAPLANE_URL } from '../utils/constants';

const usDataplaneUrl = 'https://sample.rudderlabs.com/us';
const euDataplaneUrl = 'https://sample.rudderlabs.com/eu';

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

const serverUrl = 'https://sample.rudderlabs.com';

test('When no source config dataplane url and no load call url default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When no source config dataplane url and url provided in load call url that url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl);
  expect(url).toEqual(serverUrl);
});

test('When source config dataplane url is provided that will be choosen irrespective of load call url', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl);
  expect(url).toEqual(usDataplaneUrl);
});

test('When option provides invalid residency server input + no source config dataplane url + no load call url: default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, { residencyServer: 1234 });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When option provides invalid residency server input + no source config dataplane url + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, { residencyServer: 'test' });
  expect(url).toEqual(serverUrl);
});

test('When option provides invalid residency server input + source config dataplane url + load call url provided : source config dataplane url will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, {
    residencyServer: 'test',
  });
  expect(url).toEqual(usDataplaneUrl);
});

test('When option provides valid residency server input as US + no source config dataplane url + no load call url: default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, { residencyServer: 'US' });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When option provides valid residency server input as US + no source config dataplane url + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, { residencyServer: 'US' });
  expect(url).toEqual(serverUrl);
});

test('When option provides valid residency server input as US + source config dataplane url with both US and EU + load call url provided : source config dataplane url for US region will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, {
    residencyServer: 'US',
  });
  expect(url).toEqual(usDataplaneUrl);
});

test('When option provides valid residency server input as US + source config dataplane url only EU + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithEUDataPlane, serverUrl, {
    residencyServer: 'US',
  });
  expect(url).toEqual(serverUrl);
});

test('When option provides valid residency server input as EU + no source config dataplane url + no load call url: default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, { residencyServer: 'EU' });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When option provides valid residency server input as EU + no source config dataplane url + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, { residencyServer: 'EU' });
  expect(url).toEqual(serverUrl);
});

test('When option provides valid residency server input as EU + source config dataplane url with both US and EU + load call url provided : source config dataplane url for US region will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, {
    residencyServer: 'EU',
  });
  expect(url).toEqual(euDataplaneUrl);
});

test('When option provides valid residency server input as EU + source config dataplane url with only US + load call url provided : US region url will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithUSDataPlane, serverUrl, {
    residencyServer: 'EU',
  });
  expect(url).toEqual(usDataplaneUrl);
});
