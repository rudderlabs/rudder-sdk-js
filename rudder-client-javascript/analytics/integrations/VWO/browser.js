import logger from "../../utils/logUtil";
class VWO {
  constructor(config) {
    this.accountId = config.accountId; //1549611
    this.settingsTolerance = config.settingsTolerance;
    this.isSPA = config.isSPA;
    this.libraryTolerance = config.libraryTolerance;
    this.useExistingJquery = config.useExistingJquery;
    this.sendExperimentTrack = config.sendExperimentTrack;
    this.name = "VWO";
    // console.error("COnfig ", config, this);
  }

  init() {
    var account_id = this.accountId;
    var settings_tolerance = this.settingsTolerance || 250000;
    var library_tolerance = this.libraryTolerance || 200000;
    var use_existing_jquery = this.useExistingJQuery || true;
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
              "323232" +
              "&f=" +
              +isSPA
          );
          return settings_timer;
        }
      };
    })();
    window._vwo_settings_timer = window._vwo_code.init();
    // return window._vwo_code;
    if (this.sendExperimentTrack) {
      this.experimentViewedTrack();
    }
    if (this.sendExperimentIdentify) {
      this.experimentViewedIdentify();
    }

    logger.debug("===in init VWO===");
  }

  experimentViewedTrack() {
    var dataSendingTimer;
    window.VWO = window.VWO || [];
    window.VWO.push([
      "onVariationApplied",
      function(data) {
        if (!data) {
          return;
        }
        console.log("Variation Applied");
        var expId = data[1],
          variationId = data[2];
        console.log(
          data,
          expId,
          _vwo_exp[expId].comb_n[variationId],
          _vwo_exp[expId]
        );
        if (
          typeof _vwo_exp[expId].comb_n[variationId] !== "undefined" &&
          ["VISUAL_AB", "VISUAL", "SPLIT_URL", "SURVEY"].indexOf(
            _vwo_exp[expId].type
          ) > -1
        ) {
          try {
            clearTimeout(dataSendingTimer);
            window.rudderanalytics.track("Experiment Viewed", {
              experimentId: expId,
              variationName: _vwo_exp[expId].comb_n[variationId]
            });
          } catch (error) {
            console.error("Error");
            console.error(error);
          }
        }
      }
    ]);
  }

  identify(rudderElement) {
    logger.error("method not supported");
  }

  track(rudderElement) {
    var eventName = rudderElement.message.event;
    if (eventName === "Order Completed") {
      var total = rudderElement.message.properties
        ? rudderElement.message.properties.total ||
          rudderElement.message.properties.revenue
        : 0;
      console.log("Revenue", total);
      // window._vis_opt_queue = window._vis_opt_queue || [];
      // window._vis_opt_queue.push(() => {
      //   window._vis_opt_revenue_conversion(total);
      // });
      window.VWO = window.VWO || [];
      window.VWO.push(["track.revenueConversion", total]);
    }
  }

  page(rudderElement) {
    logger.error("method not supported");
  }

  isLoaded() {
    logger.error("ISREady");
    logger.error(!!window._vwo_code);

    return !!window._vwo_code;
    logger.error("method not supported");
  }
}

export { VWO };
