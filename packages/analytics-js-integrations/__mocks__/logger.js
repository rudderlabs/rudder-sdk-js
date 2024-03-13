const setLogLevelMock = jest.fn();
const errorMock = jest.fn();
const infoMock = jest.fn();
const debugMock = jest.fn();
const warnMock = jest.fn();
const logMock = jest.fn();

jest.mock('../src/utils/logger', () => {
  const originalModule = jest.requireActual('../src/utils/logger');
  return {
    ...originalModule,
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      setLogLevel: jest.fn().mockImplementation((...args) => setLogLevelMock(...args)),
      error: jest.fn().mockImplementation((...args) => errorMock(...args)),
      info: jest.fn().mockImplementation((...args) => infoMock(...args)),
      debug: jest.fn().mockImplementation((...args) => debugMock(...args)),
      warn: jest.fn().mockImplementation((...args) => warnMock(...args)),
      log: jest.fn().mockImplementation((...args) => logMock(...args)),
    })),
  };
});

module.exports = {
  setLogLevelMock,
  errorMock,
  infoMock,
  debugMock,
  warnMock,
  logMock,
};
