import { clearCustomContext, getCustomContext, setCustomContext } from '../src/browser';

jest.mock('../src/app/RudderAnalytics', () => ({
  RudderAnalytics: jest.fn().mockImplementation(() => ({
    setCustomContext: jest.fn(),
    getCustomContext: jest.fn(),
    clearCustomContext: jest.fn(),
  })),
}));

describe('browser exports', () => {
  it('exports the custom context APIs', () => {
    expect(setCustomContext).toEqual(expect.any(Function));
    expect(getCustomContext).toEqual(expect.any(Function));
    expect(clearCustomContext).toEqual(expect.any(Function));
  });
});
