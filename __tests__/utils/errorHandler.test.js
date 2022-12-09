import { normaliseError } from '../../src/utils/errorHandler';

const staticMessage = '[handleError]::';
const customMessage = '[Device-mode]:: [Destination: Sample]:: ';

describe("Test group for 'normaliseError' method", () => {
  it('Should normaliseError for string input', () => {
    const msg = 'Sample error message';
    const errMessage = normaliseError(msg);
    expect(errMessage).toBe(`${staticMessage} "${msg}"`);
  });
  it('Should normaliseError for Error object input', () => {
    const newError = new Error('Test error');
    const errMessage = normaliseError(newError);
    expect(errMessage).toBe(`${staticMessage} "Test error"`);
  });
  it('Should normaliseError for array input', () => {
    const arr = [1, 2, 3, 4];
    const errMessage = normaliseError(arr);
    expect(errMessage).toBe(`${staticMessage} "${JSON.stringify(arr)}"`);
  });
  it('Should normaliseError for customMessage input', () => {
    const msg = 'Sample error message';
    const errMessage = normaliseError(msg, customMessage);
    expect(errMessage).toBe(`${staticMessage}${customMessage} "${msg}"`);
  });
});
