import logger from "../../utils/logUtil";
class VWO {
  constructor(config, analytics) {
    this.accountId = config.accountId; //1549611
    this.settingsTolerance = config.settingsTolerance;
    this.isSPA = config.isSPA;
    this.libraryTolerance = config.libraryTolerance;
    this.useExistingJquery = config.useExistingJquery;
    this.sendExperimentTrack = config.sendExperimentTrack;
    this.sendExperimentIdentify = config.sendExperimentIdentify;
    this.name = "VWO";
    this.analytics = analytics;
    logger.debug("Config ", config);
  }

  init() {
    logger.debug("===in init VWO===");
    var account_id = this.accountId;
    var settings_tolerance = this.settingsTolerance;
    var library_tolerance = this.libraryTolerance;
    var use_existing_jquery = this.useExistingJquery;
    var isSPA = this.isSPA;
    window._vwo_code = (function() {
      var f = false;
      var d = document;
      return {
        use_existing_jquery: function() {
          return use_existing_jquery;
        },
        library_tolerance: function() {
          return library_tolerance;
        },
        finish: function() {
          if (!f) {
            f = true;
            var a = d.getElementById("_vis_opt_path_hides");
            if (a) a.parentNode.removeChild(a);
          }
        },
        finished: function() {
          return f;
        },
        load: function(a) {
          var b = d.createElement("script");
          b.src = a;
          b.type = "text/javascript";
          b.innerText;
          b.onerror = function() {
            _vwo_code.finish();
          };
          d.getElementsByTagName("head")[0].appendChild(b);
        },
        init: function() {
          var settings_timer = setTimeout(
            "_vwo_code.finish()",
            settings_tolerance
          );
          var a = d.createElement("style"),
            b =
              "body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}",
            h = d.getElementsByTagName("head")[0];
          a.setAttribute("id", "_vis_opt_path_hides");
          a.setAttribute("type", "text/css");
          if (a.styleSheet) a.styleSheet.cssText = b;
          else a.appendChild(d.createTextNode(b));
          h.appendChild(a);
          this.load(
            "//dev.visualwebsiteoptimizer.com/j.php?a=" +
              account_id +
              "&u=" +
              encodeURIComponent(d.URL) +
              "&r=" +
              Math.random() +
              "&f=" +
              +isSPA
          );
          return settings_timer;
        }
      };
    })();
    window._vwo_settings_timer = window._vwo_code.init();

    //Send track or iddentify when
    if (this.sendExperimentTrack || this.experimentViewedIdentify) {
      this.experimentViewed();
    }
  }

  experimentViewed() {
    window.VWO = window.VWO || [];
    var self = this;
    window.VWO.push([
      "onVariationApplied",
      (data) => {
        if (!data) {
          return;
        }
        logger.debug("Variation Applied");
        var expId = data[1],
          variationId = data[2];
        logger.debug(
          "experiment id:",
          expId,
          "Variation Name:",
          _vwo_exp[expId].comb_n[variationId]
        );
        if (
          typeof _vwo_exp[expId].comb_n[variationId] !== "undefined" &&
          ["VISUAL_AB", "VISUAL", "SPLIT_URL", "SURVEY"].indexOf(
            _vwo_exp[expId].type
          ) > -1
        ) {
          try {
            if (self.sendExperimentTrack) {
              logger.debug("Tracking...");
              this.analytics.track("Experiment Viewed", {
                experimentId: expId,
                variationName: _vwo_exp[expId].comb_n[variationId]
              });
            }
          } catch (error) {
            logger.error("[VWO] experimentViewed:: ", error);
          }
          try {
            if (self.sendExperimentIdentify) {
              logger.debug("Identifying...");
              this.analytics.identify({
                [`Experiment: ${expId}`]: _vwo_exp[expId].comb_n[variationId]
              });
            }
          } catch (error) {
            logger.error("[VWO] experimentViewed:: " , error);
          }
        }
      }
    ]);
  }

  identify(rudderElement) {
    logger.debug("method not supported");
  }

  track(rudderElement) {
    var eventName = rudderElement.message.event;
    if (eventName === "Order Completed") {
      var total = rudderElement.message.properties
        ? rudderElement.message.properties.total ||
          rudderElement.message.properties.revenue
        : 0;
      logger.debug("Revenue", total);
      window.VWO = window.VWO || [];
      window.VWO.push(["track.revenueConversion", total]);
    }
  }

  page(rudderElement) {
    logger.debug("method not supported");
  }

  isLoaded() {
    return !!window._vwo_code;
  }

  isReady() {
    return !!window._vwo_code;
  }
}

export { VWO };
