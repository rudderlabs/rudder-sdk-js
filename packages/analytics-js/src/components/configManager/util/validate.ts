import { LoadOptions } from '@rudderstack/analytics-js/components/core/IAnalytics';

const WRITE_KEY_LENGHT = 24;

const validateWriteKey = (writeKey: string) => {
  if (writeKey.trim().length !== WRITE_KEY_LENGHT) {
    // throw err from here
  }
};

const isValidUrl = (url: string): boolean => url.trim().length > 0;

const validateDataPlaneUrl = (dataPlaneUrl: string) => {
  if (dataPlaneUrl.trim().length === 0) {
    // throw err from here
  }
};

const validateLoadOptions = (loadOptions: LoadOptions) => {
  console.log(loadOptions);
  // validate different load options
};

const validateLoadArgs = (
  writeKey: string,
  dataPlaneUrl: string | undefined,
  loadOptions: LoadOptions | undefined,
) => {
  validateWriteKey(writeKey);
  if (dataPlaneUrl) validateDataPlaneUrl(dataPlaneUrl);
  if (loadOptions) validateLoadOptions(loadOptions);
};

export { validateLoadArgs, isValidUrl };
