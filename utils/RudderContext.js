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
      screen.width = window.width;
      screen.height = window.height;
      screen.density = window.devicePixelRatio;
      this.userAgent = navigator.userAgent;
      // property name differs based on browser version
      this.locale = navigator.language || navigator.browserLanguage;
    }
    this.os = os;
    this.screen = screen;
    this.device = null;
    this.network = null;
  }
}
export default RudderContext;
