// Context class
import RudderApp from "./RudderApp";
import {
  RudderLibraryInfo,
  RudderOSInfo,
  RudderScreenInfo,
} from "./RudderInfo";

class RudderContext {
  constructor() {
    this.app = new RudderApp();
    this.traits = null;
    this.library = new RudderLibraryInfo();
    // this.os = null;
    const os = new RudderOSInfo();
    os.version = ""; // skipping version for simplicity now
    const screen = new RudderScreenInfo();

    // Depending on environment within which the code is executing, screen
    // dimensions can be set
    // User agent and locale can be retrieved only for browser
    // For server-side integration, same needs to be set by calling program
    if (!process.browser) {
      // server-side integration
      screen.width = 0;
      screen.height = 0;
      screen.density = 0;
      os.version = "";
      os.name = "";
      this.userAgent = null;
      this.locale = null;
    } else {
      // running within browser
      screen.width = window.screen.width;
      screen.height = window.screen.height;
      screen.density = window.devicePixelRatio;
      this.userAgent = navigator.userAgent;
      
      // For supporting Brave browser detection,
      // add "Brave/<version>" to the user agent with the version value from the Chrome component
      if (navigator.brave && Object.getPrototypeOf(navigator.brave).isBrave) {
        // Example: 
        // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36
        const matchedArr = this.userAgent.match(/(Chrome)\/([\w\.]+)/i);
        if (matchedArr) {
          this.userAgent = `${this.userAgent} Brave/${matchedArr[2]}`;
        }
      }
      // property name differs based on browser version
      this.locale = navigator.language || navigator.browserLanguage;
      screen.innerWidth = window.innerWidth;
      screen.innerHeight = window.innerHeight;
    }
    this.os = os;
    this.screen = screen;
    this.device = null;
    this.network = null;
  }
}
export default RudderContext;
