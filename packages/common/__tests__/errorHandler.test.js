import { handleError, normalizeError } from '../src/utils/errorHandler';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from '../src/utils/constants';

window.rudderanalytics = {
  errorReporting: {
    notify: jest.fn(),
  },
};

const staticMessage = '[handleError]::';
const customMessage = '[Device-mode]:: [Destination: Sample]:: ';
const sampleErrorMessage = 'Sample error message';

describe("Test group for 'normalizeError' method", () => {
  it('Should normalizeError for string input', () => {
    const msg = sampleErrorMessage;
    const errMessage = normalizeError(msg);
    expect(errMessage).toBe(`${staticMessage} "${msg}"`);
  });
  it('Should normalizeError for Error object input', () => {
    const newError = new Error('Test error');
    const errMessage = normalizeError(newError);
    expect(errMessage).toBe(`${staticMessage} "Test error"`);
  });
  it('Should normalizeError for array input', () => {
    const arr = [1, 2, 3, 4];
    const errMessage = normalizeError(arr);
    expect(errMessage).toBe(`${staticMessage} "${JSON.stringify(arr)}"`);
  });
  it('Should normalizeError for customMessage input', () => {
    const msg = sampleErrorMessage;
    const errMessage = normalizeError(msg, customMessage);
    expect(errMessage).toBe(`${staticMessage}${customMessage} "${msg}"`);
  });
  it('Should normalizeError for object with message property input', () => {
    const msg = sampleErrorMessage;
    const errMessage = normalizeError({ message: msg });
    expect(errMessage).toBe(`${staticMessage} "${msg}"`);
  });
  it('Should normalizeError for object with no message property input', () => {
    const obj = { random: 12345678 };
    const errMessage = normalizeError(obj);
    expect(errMessage).toBe(`${staticMessage} "${JSON.stringify(obj)}"`);
  });
});

describe("Test group for 'handleError' method", () => {
  it('Should notify errors when the error is not coming from request failed', () => {
    const errMessage = `sample error message`;
    const err = new Error(errMessage);
    handleError(err);
    expect(window.rudderanalytics.errorReporting.notify).toHaveBeenCalledWith(err);
  });
  it('Should not notify for request failed errors', () => {
    const errMessage = `${FAILED_REQUEST_ERR_MSG_PREFIX} 504 for url: https://example.com`;
    const obj = new Error(errMessage);
    handleError(obj);
    expect(window.rudderanalytics.errorReporting.notify).not.toHaveBeenCalled();
  });
});
