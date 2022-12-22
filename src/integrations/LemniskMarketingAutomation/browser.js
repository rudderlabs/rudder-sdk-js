/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { NAME } from './constants';

class LemniskMarketingAutomation{
    constructor(config,analytics){
        if(analytics.logLevel) {
            logger.setLogLevel(analytics.logLevel);
        }
        this.accountId = config.accountId;
        this.writeKey = config.deviceModeWriteKey;
        this.name = NAME;
        this._ready = false;
        
    }
    init() {
        const self = this;
        logger.debug('===in init Lemnisk Marketing Automation===');
        (function(window,tag,o,a,r){
            window.lmSMTObj = window.lmSMTObj || [];
            var methods = [
                "init",
                "page",
                "track",
                "identify"
            ];
            for (var i=0; i<methods.length; i++) {
                lmSMTObj[methods[i]] = function(methodName){
                    return function(){
                        lmSMTObj.push([methodName].concat(Array.prototype.slice.call(arguments)));
                    };
                }(methods[i]);
            
            }
            lmSMTObj.init(self.writeKey);
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.setAttribute('data-loader', LOAD_ORIGIN);
            r.type = "text/javascript";
            r.async = 1;
            r.src = tag;
            a.appendChild(r);
        })(
            window,
            document.location.protocol === 'https:' ? 'https://cdn25.lemnisk.co/ssp/st/' + self.accountId + '.js' : 'http://cdn25.lemnisk.co/ssp/st/' + self.accountId + '.js',
            document
        );
        self._ready = true;
    }
    isReady() {
        logger.debug('===In isReady Lemnisk Marketing Automation===');
        return this._ready;
    }
    identify(rudderElement){
        logger.debug('===In Lemnisk Marketing Automation identify===');
        const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
        if (!userId) {
          logger.debug('[LemniskMarketingAutomation] identify:: user id is required');
          return;
        }
        const { traits } = rudderElement.message.context;
        window.lmSMTObj.identify(rudderElement.message.userId, traits);
    }
    track(rudderElement){
        logger.debug('===In Lemnisk Marketing Automation track===');
        const {event, properties } = rudderElement.message;

        if (!event) {
            logger.error('Event name is missing!');
            return;
        }
        if (properties) {
            window.lmSMTObj.track(event, properties);
        }else{
            window.lmSMTObj.track(event);
        }
    }
    page(rudderElement){
        logger.debug('===In Lemnisk Marketing Automation page===');
        const {name, properties } = rudderElement.message;
        console.log(window.lmSMTObj);
        if (name && !properties){
            window.lmSMTObj.page(name);
        }else if(!name && properties){
            window.lmSMTObj.page(properties);
        }else if(name && properties){
            window.lmSMTObj.page(name,properties);
        }else{
            window.lmSMTObj.page();
        }
    }
    isLoaded() {
        logger.debug('===In isLoaded Lemnisk Marketing Automation===');
        return this._ready;
    }
    
    isReady() {
        logger.debug('===In isReady Lemnisk Marketing Automation===');
        return this._ready;
    }
}
export default LemniskMarketingAutomation;