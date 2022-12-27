/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
import Storage from '../../../utils/storage';
import logger from '../../../utils/logUtil';
import {
  DEFAULT_SESSION_TIMEOUT,
  MIN_SESSION_TIMEOUT,
  MIN_SESSION_ID_LENGTH,
} from '../../../utils/constants';
import { countDigits } from '../../../utils/utils';
import { handleError } from '../../../utils/errorHandler';

class UserSession {
  constructor() {
    this.storage = Storage;
    this.timeout = DEFAULT_SESSION_TIMEOUT;
    // Fetch session information from storage if any or enable auto track
    this.sessionInfo = this.storage.getSessionInfo() || { autoTrack: true };
  }

  /**
   * A function to initialize session information
   * @param {object} options    load call options
   */
  initialize(options) {
    try {
      /**
       * By default this.autoTrack will be true
       * Cases where this.autoTrack will be false:
       * 1. User explicitly set autoTrack load option to false
       * 2. When user is manually tracking the session
       *
       * Depending on the use case, this.autoTrack is set to true/false.
       */
      this.sessionInfo.autoTrack = !(
        options?.sessions?.autoTrack === false || this.sessionInfo.manualTrack
      );
      /**
       * Validate "timeout" input. Should be provided in milliseconds.
       * Session timeout: By default, a session lasts until there's 30 minutes of inactivity,
       * but you can configure this limit using "timeout" load option
       */
      if (options?.sessions && !isNaN(options.sessions.timeout)) {
        const { timeout } = options.sessions;
        // In case user provides 0 as the timeout, auto session tracking will be disabled
        if (timeout === 0) {
          logger.warn(
            '[Session]:: Provided timeout value 0 will disable the auto session tracking feature.',
          );
          this.sessionInfo.autoTrack = false;
        }
        // In case user provides a setTimeout value greater than 0 but less than 10 seconds SDK will show a warning
        // and will proceed with it
        if (timeout > 0 && timeout < MIN_SESSION_TIMEOUT) {
          logger.warn('[Session]:: It is not advised to set "timeout" less than 10 seconds');
        }
        this.timeout = timeout;
      }
      // If auto session tracking is enabled start the session tracking
      if (this.sessionInfo.autoTrack) {
        this.startAutoTracking();
      } else if (this.sessionInfo.autoTrack === false && !this.sessionInfo.manualTrack) {
        /**
         * Use case:
         * By default user session is enabled which means storage will have session data.
         * In case user wanted to opt out and set auto track to false through load option,
         * clear stored session info.
         */
        this.end();
      }
    } catch (e) {
      handleError(e);
    }
  }

  /**
   * A function to validate current session and return true/false depending on that
   * @param {number} timestamp
   * @returns boolean
   */
  isValidSession(timestamp) {
    return timestamp <= this.sessionInfo.expiresAt;
  }

  /**
   * A function to generate session id
   * @returns number
   */
  generateSessionId() {
    return Date.now();
  }

  /**
   * A function to check for existing session details and depending on that create a new session.
   */
  startAutoTracking() {
    const timestamp = Date.now();
    if (!this.isValidSession(timestamp)) {
      this.sessionInfo = {};
      this.sessionInfo.id = timestamp; // set the current timestamp
      this.sessionInfo.expiresAt = timestamp + this.timeout; // set the expiry time of the session
      this.sessionInfo.sessionStart = true;
      this.sessionInfo.autoTrack = true;
    }
    this.storage.setSessionInfo(this.sessionInfo);
  }

  /**
   * Function to validate user provided sessionId
   * @param {number} sessionId
   * @returns
   */
  validateSessionId(sessionId) {
    if (typeof sessionId !== 'number' || sessionId % 1 !== 0) {
      logger.error(`[Session]:: "sessionId" should only be a positive integer`);
      return;
    }
    if (countDigits(sessionId) < MIN_SESSION_ID_LENGTH) {
      logger.error(
        `[Session]:: "sessionId" should at least be "${MIN_SESSION_ID_LENGTH}" digits long`,
      );
      return;
    }
    return sessionId;
  }

  /**
   * A public method to start a session
   * @param {number} sessionId     session identifier
   * @returns
   */
  start(id) {
    const sessionId = id ? this.validateSessionId(id) : this.generateSessionId();

    this.sessionInfo = {
      id: sessionId || this.generateSessionId(),
      sessionStart: true,
      manualTrack: true,
    };
    this.storage.setSessionInfo(this.sessionInfo);
  }

  /**
   * A function to return current session id
   * @returns string sessionId
   */
  getSessionId() {
    if (
      (this.sessionInfo.autoTrack && this.isValidSession(Date.now())) ||
      this.sessionInfo.manualTrack
    ) {
      return this.sessionInfo.id;
    }
    return null;
  }

  /**
   * A public method to end an ongoing session.
   */
  end() {
    this.sessionInfo = {};
    this.storage.removeSessionInfo();
  }

  /**
   * A function get ongoing sessionId.
   */
  getSessionInfo() {
    const session = {};
    if (this.sessionInfo.autoTrack || this.sessionInfo.manualTrack) {
      // renew or create a new auto-tracking session
      if (this.sessionInfo.autoTrack) {
        const timestamp = Date.now();
        if (!this.isValidSession(timestamp)) {
          this.startAutoTracking();
        } else {
          this.sessionInfo.expiresAt = timestamp + this.timeout; // set the expiry time of the session
        }
      }

      if (this.sessionInfo.sessionStart) {
        session.sessionStart = true;
        this.sessionInfo.sessionStart = false;
      }
      session.sessionId = this.sessionInfo.id;
      this.storage.setSessionInfo(this.sessionInfo);
    }
    return session;
  }

  /**
   * Refresh session info on reset API call
   */
  reset() {
    const { manualTrack, autoTrack } = this.sessionInfo;
    if (autoTrack) {
      this.sessionInfo = {};
      this.startAutoTracking();
    } else if (manualTrack) {
      this.start();
    }
  }
}

const userSession = new UserSession();
export { userSession as UserSession };
