import { resolveDataPlaneUrl } from '../utils/utils';
import { DEFAULT_DATAPLANE_URL } from '../utils/constants';

const sourceConfigWithBothDataPlane = {
  source: {
    dataplanes: {
      US: [
        {
          url: 'https://sample.rudderlabs.com/us',
          default: true,
        },
      ],
      EU: [
        {
          url: 'https://sample.rudderlabs.com/eu',
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
          url: 'https://sample.rudderlabs.com/us',
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
          url: 'https://sample.rudderlabs.com/eu',
          default: true,
        },
      ],
    },
  },
};

const serverUrl = 'https://sample.rudderlabs.com';

test('When no sc url and no load call url default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, undefined);
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When no sc url and url provided in load call url that url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, undefined);
  expect(url).toEqual(serverUrl);
});

test('When sc url is provided that will be choosen irrespective of load call url', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, undefined);
  const defaultRegion = sourceConfigWithBothDataPlane.source.dataplanes['US'][0];
  expect(url).toEqual(defaultRegion.url);
});

test('When User provides invalid residency server input + no sc url + no load call url: default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, { residencyServer: 1234 });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When User provides invalid residency server input + no sc url + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, { residencyServer: 'test' });
  expect(url).toEqual(serverUrl);
});

test('When User provides invalid residency server input + sc url + load call url provided : sc url will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, {
    residencyServer: 'test',
  });
  const defaultRegion = sourceConfigWithBothDataPlane.source.dataplanes['US'][0];
  expect(url).toEqual(defaultRegion.url);
});

test('When User provides valid residency server input as US + no sc url + no load call url: default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, { residencyServer: 'US' });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When User provides valid residency server input as US + no sc url + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, { residencyServer: 'US' });
  expect(url).toEqual(serverUrl);
});

test('When User provides valid residency server input as US + sc url with both US and EU + load call url provided : sc url for US region will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, {
    residencyServer: 'US',
  });
  const defaultRegion = sourceConfigWithBothDataPlane.source.dataplanes['US'][0];
  expect(url).toEqual(defaultRegion.url);
});

test('When User provides valid residency server input as US + sc url only EU + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithEUDataPlane, serverUrl, {
    residencyServer: 'US',
  });
  expect(url).toEqual(serverUrl);
});

test('When User provides valid residency server input as EU + no sc url + no load call url: default will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, undefined, { residencyServer: 'EU' });
  expect(url).toEqual(DEFAULT_DATAPLANE_URL);
});

test('When User provides valid residency server input as EU + no sc url + load call url provided : load call url will be choosen', () => {
  const url = resolveDataPlaneUrl({ source: {} }, serverUrl, { residencyServer: 'EU' });
  expect(url).toEqual(serverUrl);
});

test('When User provides valid residency server input as EU + sc url with both US and EU + load call url provided : sc url for US region will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithBothDataPlane, serverUrl, {
    residencyServer: 'EU',
  });
  const defaultRegion = sourceConfigWithBothDataPlane.source.dataplanes['EU'][0];
  expect(url).toEqual(defaultRegion.url);
});

test('When User provides valid residency server input as EU + sc url with only US + load call url provided : US region url will be choosen', () => {
  const url = resolveDataPlaneUrl(sourceConfigWithUSDataPlane, serverUrl, {
    residencyServer: 'EU',
  });
  const defaultRegion = sourceConfigWithUSDataPlane.source.dataplanes['US'][0];
  expect(url).toEqual(defaultRegion.url);
});
