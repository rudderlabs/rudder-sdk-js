import { isDefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { state } from '../../../state';

const detectAdBlockers = (httpClient: IHttpClient): void => {
  // Apparently, '?view=ad' is a query param that is blocked by majority of adblockers

  // Use source config URL here as it is very unlikely to be blocked by adblockers
  // Only the extra query param should make it vulnerable to adblockers
  // This will work even if the users proxies it.
  // The edge case where this doesn't work is when HEAD method is not allowed by the server (user's)
  const baseUrl = new URL(state.lifecycle.sourceConfigUrl.value as string);
  const url = `${baseUrl.origin}${baseUrl.pathname}?view=ad`;

  httpClient.request({
    url,
    options: {
      // We actually don't need the response from the request, so we are using HEAD
      method: 'HEAD',
      useAuth: true,
    },
    isRawResponse: true,
    callback: (result, details) => {
      // not ad blocked if the request is successful or it is not internally redirected on the client side
      // Often adblockers instead of blocking the request, they redirect it to an internal URL
      state.capabilities.isAdBlocked.value =
        isDefined(details.error) || (details.response as Response).redirected === true;
    },
  });
};

export { detectAdBlockers };
