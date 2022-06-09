// Context class
import RudderApp from './RudderApp';
import { RudderLibraryInfo, RudderOSInfo, RudderScreenInfo } from './RudderInfo';

class RudderContext {
  constructor() {
    this.app = new RudderApp();
    this.traits = null;
    this.library = new RudderLibraryInfo();
    this.userAgent = null;
    this.device = null;
    this.network = null;
    this.os = new RudderOSInfo();
    this.locale = null;
    this.screen = new RudderScreenInfo();

    // Depending on environment within which the code is executing, screen
    // dimensions can be set
    // User agent and locale can be retrieved only for browser
    // For server-side integration, same needs to be set by calling program
    if (process.browser) {
      // running within browser
      this.screen.width = window.screen.width;
      this.screen.height = window.screen.height;
      this.screen.density = window.devicePixelRatio;
      this.screen.innerWidth = window.innerWidth;
      this.screen.innerHeight = window.innerHeight;

      // detect brave browser and append to the user agent
      if (navigator.brave && Object.getPrototypeOf(navigator.brave).isBrave) {
        const version = navigator.userAgent.match(/(Chrome)\/([\w\.]+)/i)[2];
        this.userAgent = `${navigator.userAgent} Brave/${version}`;
      } else {
        this.userAgent = navigator.userAgent;
      }

      // property name differs based on browser version
      this.locale = navigator.language || navigator.browserLanguage;
    }
  }
}
export default RudderContext;
