/* eslint-disable no-unused-expressions */

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
    let div;
    if (!this.projectId) {
      logger.debug("Project ID missing");
      return;
    }

    if (!this.brandId) {
        logger.debug("Brand ID missing");
        return;
      }
    
      let projectIdFormatted = this.projectId.replace(/_/g, "");
      projectIdFormatted = projectIdFormatted.toLowerCase().trim();

    (function () {
      var g = function (e, h, f, g) {
        this.get = function (a) { for (var a = a + "=", c = document.cookie.split(";"), b = 0, e = c.length; b < e; b++) { for (var d = c[b]; " " == d.charAt(0);)d = d.substring(1, d.length); if (0 == d.indexOf(a)) return d.substring(a.length, d.length) } return null };
        this.set = function (a, c) { var b = "", b = new Date; b.setTime(b.getTime() + 6048E5); b = "; expires=" + b.toGMTString(); document.cookie = a + "=" + c + b + "; path=/; " };
        this.check = function () { var a = this.get(f); if (a) a = a.split(":"); else if (100 != e) "v" == h && (e = Math.random() >= e / 100 ? 0 : 100), a = [h, e, 0], this.set(f, a.join(":")); else return !0; var c = a[1]; if (100 == c) return !0; switch (a[0]) { case "v": return !1; case "r": return c = a[2] % Math.floor(100 / c), a[2]++, this.set(f, a.join(":")), !c }return !0 };
        this.go = function () { if (this.check()) { var a = document.createElement("script"); a.type = "text/javascript"; a.src = g; document.body && document.body.appendChild(a) } };
        this.start = function () { var t = this; "complete" !== document.readyState ? window.addEventListener ? window.addEventListener("load", function () { t.go() }, !1) : window.attachEvent && window.attachEvent("onload", function () { t.go() }) : t.go() };
      };
      try { (new g(100, "r", `QSI_S_${this.projectId}`, `https://${projectIdFormatted}-${this.brandId}.siteintercept.qualtrics.com/SIE/?Q_ZID=${this.projectId}`)).start() } catch (i) { }
    })();
    div = document.createElement('div');
    div.setAttribute("id", this.projectId);
    window._qsie = window._qsie || [];

  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    logger.debug("===in Qualtrics isLoaded===");
    return !!(window.window._qsie && window._qsie.push !== Array.prototype.push);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug("===in Qualtrics isReady===");
    return !!(window._qsie &&window._qsie.push !== Array.prototype.push);
  }

  page (rudderElement) {
    const {message} = rudderElement;
    if(this.enableGenericPageTitle) {
      window._qsie.push("viewed a page");
    } else {
      window._qsie.push(`Viewed a ${message.name} page`);
    }
  }

  track(rudderElement) {
      const {message} = rudderElement;
      window._qsie.push(message.event);
    
  }
}
export default Qualtrics;
