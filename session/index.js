/* eslint-disable import/prefer-default-export */
import Storage from '../utils/storage';
import logger from '../utils/logUtil';
import {
  DEFAULT_SESSION_TIMEOUT,
  MIN_SESSION_TIMEOUT,
} from "../utils/constants";

class Session {
  constructor() {
    this.storage = Storage;
    this.sessionTimeout = DEFAULT_SESSION_TIMEOUT;
  }

  /**
   * A function to initialize session information
   * @param {object} options    load call options
   */
  initialize(options) {
    // Fetch session information from storage if any or initialize with an empty object
    this.sessionInfo = this.storage.getSessionInfo() || {};
    /**
     * By default this.autoTrackSession will be true
     * Cases where this.autoTrackSession will be false:
     * 1. User explicitly set autoTrackSession load option to false
     * 2. When user is manually tracking the session
     *
     * Depending on the use case, this.autoTrackSession is set to true/false.
     */
    this.autoTrackSession = !(
      (options && options.autoTrackSession === false) ||
      this.sessionInfo.manuallyTrackSession
    );
    /**
     * Validate "sessionTimeout" input. Should be provided in milliseconds.
     * Session timeout: By default, a session lasts until there's 30 minutes of inactivity,
     * but you can configure this limit using "sessionTimeout" load option
     */
    if (options && typeof options.sessionTimeout === 'number') {
      // In case user provides 0 as the sessionTimeout, auto session tracking will be disabled
      if (options.sessionTimeout === 0) {
        logger.warn(
          '[Session]:: Provided sessionTimeout value 0 will disable the auto session tracking feature.',
        );
        this.autoTrackSession = false;
      }
      // In case user provides a setTimeout value greater than 0 but less than 10 seconds SDK will show a warning
      // and will proceed with it
      if (
        options.sessionTimeout > 0 &&
        options.sessionTimeout < MIN_SESSION_TIMEOUT
      ) {
        logger.warn('[Session]:: It is not advised to set "sessionTimeout" less than 10 seconds');
      }
      this.sessionTimeout = options.sessionTimeout;
    }
    // If auto session tracking is enabled start the session tracking
    if (this.autoTrackSession) {
      this.startAutoTracking();
    } else if (
      Object.keys(this.sessionInfo).length &&
      !this.sessionInfo.manuallyTrackSession
    ) {
      this.endSession();
    }
  }

  /**
   * A function to validate current session and return true/false depending on that
   * @param {number} timestamp
   * @returns boolean
   */
  isValidSession(timestamp) {
    return (
      Object.keys(this.sessionInfo).length &&
      typeof this.sessionInfo.expiresAt === 'number' &&
      timestamp <= this.sessionInfo.expiresAt
    );
  }

  /**
   * A function to check for existing session details and depending on that create a new session.
   */
  startAutoTracking() {
    const timestamp = Date.now();
    if (!this.isValidSession(timestamp)) {
      this.sessionInfo.id = timestamp.toString(); // set the current timestamp
      this.sessionInfo.expiresAt = timestamp + this.sessionTimeout; // set the expiry time of the session
      this.sessionInfo.sessionStart = false;
    }
    this.storage.setSessionInfo(this.sessionInfo);
  }

  /**
   * A public method to start a session
   * @param {string} sessionId     session identifier
   * @returns
   */
  start(sessionId) {
    if (sessionId && typeof sessionId !== 'string') {
      logger.error(`[Session]:: "sessionId" should be in string format`);
      return;
    }
    if (
      !this.sessionInfo.manuallyTrackSession ||
      !Object.keys(this.sessionInfo).length ||
      !this.sessionInfo.id
    ) {
      this.autoTrackSession = false;
      this.sessionInfo = {
        id: sessionId || Date.now(),
        sessionStart: false,
        manuallyTrackSession: true,
      };
    }
    this.storage.setSessionInfo(this.sessionInfo);
  }

  /**
   * A public method to end an ongoing session.
   */
  end() {
    this.sessionInfo = {};
    this.storage.removeSessionInfo();
  }

  /**
   * A function to update an ongoing session.
   */
  update(timestamp) {
    if (!this.sessionInfo.manuallyTrackSession)
      this.sessionInfo.expiresAt = timestamp + this.sessionTimeout; // set the expiry time of the session
    if (!this.sessionInfo.sessionStart) this.sessionInfo.sessionStart = true;
    this.storage.setSessionInfo(this.sessionInfo);
  }

  /**
   * A function get ongoing sessionId.
   */
  getSessionId(timestamp) {
    if (
      !this.sessionInfo.manuallyTrackSession &&
      !this.isValidSession(timestamp)
    ) {
      this.startAutoTracking();
    }
    return this.sessionInfo.id;
  }
}

const session = new Session();

export { session as Session };
