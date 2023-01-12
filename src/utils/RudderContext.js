// Context class
import RudderApp from './RudderApp';
import { RudderLibraryInfo, RudderOSInfo } from './RudderInfo';
import { getUserAgent, getLanguage } from './navigator';
import { getScreenDetails } from './screenDetails';

class RudderContext {
  constructor() {
    this.app = new RudderApp();
    this.traits = null;
    this.library = new RudderLibraryInfo();
    this.userAgent = getUserAgent();
    this.device = null;
    this.network = null;
    this.os = new RudderOSInfo();
    this.locale = getLanguage();
    this.screen = getScreenDetails();
  }
}

export default RudderContext;
