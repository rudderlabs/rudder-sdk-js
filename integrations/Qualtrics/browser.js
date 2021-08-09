/* eslint-disable new-cap */
/* eslint-disable no-empty */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
// eslint-disable-next-line no-nested-ternary
// eslint-disable-next-line class-methods-use-this

import logger from "../../utils/logUtil";

class Qualtrics {
  constructor(config) {
    this.name = "Qualtrics";
    this.projectId = config.projectId;
    this.brandId = config.brandId;
    this.enableGenericPageTitle = config.enableGenericPageTitle;
  }

  init() {
    logger.debug("===in init Qualtrics===");
    if (!this.projectId) {
      logger.debug("Project ID missing");
      return;
    }

    if (!this.brandId) {
      logger.debug("Brand ID missing");
      return;
    }

    const projectIdFormatted = this.projectId
      .replace(/_/g, "")
      .toLowerCase()
      .trim();
    const requestUrlFormatted = `https://${projectIdFormatted}-${this.brandId}.siteintercept.qualtrics.com/SIE/?Q_ZID=${this.projectId}`;
    const requestIdFormatted = `QSI_S_${this.projectId}`;

    (function () {
      var g = function (e, h, f, g) {
        this.get = function (a) { for (var a = a + "=", c = document.cookie.split(";"), b = 0, e = c.length; b < e; b++) { for (var d = c[b]; " " == d.charAt(0);)d = d.substring(1, d.length); if (0 == d.indexOf(a)) return d.substring(a.length, d.length) } return null };
        this.set = function (a, c) { var b = "", b = new Date; b.setTime(b.getTime() + 6048E5); b = "; expires=" + b.toGMTString(); document.cookie = a + "=" + c + b + "; path=/; " };
        this.check = function () { var a = this.get(f); if (a) a = a.split(":"); else if (100 != e) "v" == h && (e = Math.random() >= e / 100 ? 0 : 100), a = [h, e, 0], this.set(f, a.join(":")); else return !0; var c = a[1]; if (100 == c) return !0; switch (a[0]) { case "v": return !1; case "r": return c = a[2] % Math.floor(100 / c), a[2]++, this.set(f, a.join(":")), !c }return !0 };
        this.go = function () { if (this.check()) { var a = document.createElement("script"); a.type = "text/javascript"; a.src = g; document.body && document.body.appendChild(a) } };
        this.start = function () { var t = this; "complete" !== document.readyState ? window.addEventListener ? window.addEventListener("load", function () { t.go() }, !1) : window.attachEvent && window.attachEvent("onload", function () { t.go() }) : t.go() };
      };
      try {
        new g(100, "r", requestIdFormatted, requestUrlFormatted).start();
      } catch (i) {}
    })();

    const div = document.createElement("div");
    div.setAttribute("id", String(this.projectId));
    window._qsie = window._qsie || [];
    document.getElementsByTagName("head")[0].appendChild(div);
  }

  isLoaded() {
    logger.debug("===in Qualtrics isLoaded===");
    return !!(window._qsie && window.QSI && window.QSI.API);
  }

  isReady() {
    logger.debug("===in Qualtrics isReady===");
    return !!(window._qsie && window.QSI && window.QSI.API);
  }

  page(rudderElement) {
    logger.debug("===in Qualtrics page===");
    const { message } = rudderElement;
    if (!message) {
      logger.debug("Message field is missing");
      return;
    }

    if (this.enableGenericPageTitle) {
      window._qsie.push("Viewed a Page");
      return;
    }

    const { name, category, properties } = message;
    const categoryField =
      category ||
      (properties && properties.category ? properties.category : null);

    if (!categoryField && !name) {
      logger.debug(
        "generic title is disabled and no name or category field found"
      );
      return;
    }
    const dynamicTitle =
      categoryField && name
        ? `Viewed ${categoryField} ${name} Page`
        : `Viewed ${name} Page`;

    window._qsie.push(dynamicTitle);
  }

  track(rudderElement) {
    logger.debug("===in Qualtrics track===");
    const { message } = rudderElement;
    if (!message) {
      logger.debug("Message field is missing");
      return;
    }
    if (!message.event) {
      logger.debug("Event field is undefined");
      return;
    }
    window._qsie.push(message.event);
  }
}
export default Qualtrics;
