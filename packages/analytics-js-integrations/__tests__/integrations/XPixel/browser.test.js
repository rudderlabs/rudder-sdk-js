import { XPixel } from '../../../src/integrations/XPixel';

afterAll(() => {
  jest.restoreAllMocks();
});
const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};

const basicConfig = {
  pixelId: '12567839',
  eventToEventIdMap: [
    { from: 'Sign Up', to: '123' },
    { to: 'Lead', from: '1234' },
    { from: 'Page View', to: '456' },
    { from: 'Page View', to: '467' },
    { from: 'product_added', to: '789' },
  ],
};

describe('XPixel init tests', () => {
  let xPixel;

  test('Testing init call of XPixel', () => {
    xPixel = new XPixel(basicConfig, { loglevel: 'debug' }, destinationInfo);
    xPixel.init();
    expect(typeof window.twq).toBe('object');
  });
});
