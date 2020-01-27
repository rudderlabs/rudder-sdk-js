import logger from "../../utils/logUtil";

class INTERCOM {
  constructor(config) {
    this.NAME = "INTERCOM";
    this.API_KEY = config.apiKey;
    this.APP_ID = config.appId;
    this.MOBILE_API_KEY = config.mobileAppId;
    logger.debug("Config ", config);
  }

  init() {
    window.intercomSettings = {
      app_id: this.APP_ID
    };
    (function() {
      if (typeof window.INTERCOM === "function") {
        window.INTERCOM("reattach_activator");
        window.INTERCOM("update", window.intercomSettings);
      } else {
        var i = function() {
          i.c(arguments);
        };
        i.q = [];
        i.c = function(args) {
          i.q.push(args);
        };
        window.INTERCOM = i;
        var l = function() {
          var s = document.createElement("script");
          s.type = "text/javascript";
          s.async = true;
          s.src =
            "https://widget.intercom.io/widget/" +
            window.intercomSettings.app_id;
          var x = document.getElementsByTagName("script")[0];
          x.parentNode.insertBefore(s, x);
        };
        if (document.readyState === "complete") {
          l();
          window.intercom_code = true;
        } else if (window.attachEvent) {
          window.attachEvent("onload", l);
          window.intercom_code = true;
        } else {
          window.addEventListener("load", l, false);
          window.intercom_code = true;
        }
      }
    })();
  }

  page() {
    // Get new messages of the current user
    window.INTERCOM("update");
  }

  identify(rudderElement) {
    // Create or update a user

    let rawPayload = {};
    const context = rudderElement.message.context;

    // identity verification
    const identityVerificationProps = context.Intercom
      ? context.Intercom
      : null;
    if (identityVerificationProps != null) {
      // user hash
      const userHash = context.Intercom.user_hash
        ? context.Intercom.user_hash
        : null;

      if (userHash != null) {
        rawPayload.user_hash = userHash;
      }

      // hide default launcher
      const hideDefaultLauncher = context.Intercom.hideDefaultLauncher
        ? context.Intercom.hideDefaultLauncher
        : null;

      // if(hideDefaultLauncher!= null){
      //   rawPayload.hideDefaultLauncher = ;

      // }
    }

    // Map rudder properties payload to intercom's paylod
    Object.keys(context.traits).forEach(field => {
      const value = context.traits[field];

      if (field === "company") {
        let companies = [];
        let company = {};
        const companyFields = Object.keys(context.traits[field]);

        companyFields.forEach(key => {
          if (key != "id") {
            company[key] = context.traits[field][key];
          } else {
            company["company_id"] = context.traits[field][key];
          }
        });

        if (!companyFields.includes("id")) {
          company["company_id"] = md5(company.name);
        }

        companies.push(company);
        rawPayload.companies = companies;
      }

      switch (field) {
        case "createdAt":
          rawPayload["created_at"] = value;
          break;
        case "anonymousId":
          rawPayload["user_id"] = value;
          break;

        default:
          break;
      }
    });

    window.INTERCOM("update", rawPayload);
  }

  track(rudderElement) {
    // Track events

    let rawPayload = {};
    const message = rudderElement.message;

    const properties = message.properties
      ? Object.keys(message.properties)
      : null;

    // udpate properties
    if (properties) {
      let metadata = {
        price: {},
        order_number: {}
      };

      properties.forEach(property => {
        const value = message.properties[property];

        switch (property) {
          case "price":
            metadata.price["amount"] = value * 100;
            break;
          case "currency":
            metadata.price["currency"] = value;
          default:
            break;
        }

        switch (property) {
          case "order_ID" || "order_url":
            metadata.order_number["value"] = value;
            break;
          default:
            break;
        }
      });
      rawPayload.metadata = metadata;
    }

    if (message.event) {
      rawPayload.event_name = message.event;
    }
    rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
    rawPayload.created_at = Math.floor(
      new Date(message.originalTimestamp).getTime() / 1000
    );

    // final call to intercom
    window.INTERCOM("trackEvent", rawPayload);
  }

  isLoaded() {
    return !!window.intercom_code;
  }
}

export { INTERCOM };
