import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { Nullable } from '@rudderstack/analytics-js/types/Nullable';
import { AMP_LINKER_ANONYMOUS_ID_KEY } from './constants';
import parseLinker from './utils';

// TODO: refactor this plugin and all related sourcecode to be typesafe
const googleLinker = (): ExtensionPlugin => ({
  name: 'googleLinker',
  userSession: {
    anonymousIdGoogleLinker(rudderAmpLinkerParam?: Nullable<string>): Nullable<string> {
      if (!rudderAmpLinkerParam) {
        return null;
      }

      const parsedAnonymousIdObj = rudderAmpLinkerParam ? parseLinker(rudderAmpLinkerParam) : null;
      return parsedAnonymousIdObj ? parsedAnonymousIdObj[AMP_LINKER_ANONYMOUS_ID_KEY] : null;
    },
  },
});

export { googleLinker };

export default googleLinker;
