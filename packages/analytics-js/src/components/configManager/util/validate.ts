const WRITE_KEY_LENGHT = 24;

const validateWriteKey = (writeKey: string) => {
  if (writeKey.trim().length !== WRITE_KEY_LENGHT) {
    throw Error('Unable to load the SDK due to invalid writeKey');
  }
};

const isValidUrl = (url: string): boolean => url.trim().length > 0;

const validateDataPlaneUrl = (dataPlaneUrl: string) => {
  if (dataPlaneUrl.trim().length === 0) {
    throw Error('Unable to load the SDK due to invalid dataPlaneUrl');
  }
};

const validateLoadArgs = (writeKey: string, dataPlaneUrl: string | undefined) => {
  validateWriteKey(writeKey);
  if (dataPlaneUrl) validateDataPlaneUrl(dataPlaneUrl);
};

export { validateLoadArgs, isValidUrl };
