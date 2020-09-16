
import logger from "../../utils/logUtil";

class Lytics {
    constructor(config) {
        this.accountId = config.accountId;
        this.stream = config.stream;
        this.blockload = config.blockload;
        this.loadid = config.loadid;
        this.name = "LYTICS"
    }
    loadLyticsScript() {
        !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
        // Define config and initialize Lytics tracking tag.
        window.jstag.init({
          url: "//c.lytics.io",
          cid: this.accountId,
          loadid: this.loadid,
          blocked: this.blockload,
          stream: this.stream,
          sessecs: 1800,
          src: `//c.lytics.io/api/tag/${this.accountId}/latest.min.js`
        });
      }

      init() {
          this.loadLyticsScript();
          logger.debug("===in init Lytics===");
      }

      isLoaded() {
        logger.debug("in Lytics isLoaded");
        return !!(window.jstag && window.jstag.bind);
      }
    
      isReady() {
        logger.debug("in Lytics isReady");
        return !!(window.jstag && window.jstag.bind);
      }

      identify(rudderElement) {
        logger.debug("in Lytics identify");
          const user_id = rudderElement.message.userId || rudderElement.message.anonymousId;
          const  { traits } = rudderElement.message.context;
          const payload = {user_id, ...traits};
          window.jstag(this.stream,payload)
      }


}
export default Lytics;