import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import md5 from "md5";

class Criteo{
    constructor(config) {
        this.name = "Criteo",
        this.hash_method = config.hashMethod,
        this.accountId = config.accountId,
        this.url = config.homePageUrl,
        this.deviceType = /iPad/.test(navigator.userAgent)
        ? "t"
        : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(
            navigator.userAgent
          )
        ? "m"
        : "d";
        this.fieldMapping = config.fieldMapping;
    }


init() {
    logger.debug("===in init Criteo===");
    if (!this.accountId) {
        return;
    }
    window.criteo_q = window.criteo_q || [];
    
    ScriptLoader(
      "Criteo",
      `//dynamic.criteo.com/js/ld/ld.js?a=${this.accountId}`
    );
    window.criteo_q.push({ event: 'setAccount', account: account });
    window.criteo_q.push({ event: 'setSiteType', type: this.deviceType });
  }

  isLoaded() {
    logger.debug("in Criteo isLoaded");
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("in Criteo isReady");
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  handleCommonFields (rudderElement) {
    const {message} = rudderElement;
    const {properties} = message;

    let setEmail = {};
    let setZipcode = {};

    let finalRequest=[
        { event: "setCustomerId", id: md5(message.userId) },
        { event: "setRetailerVisitorId", id: md5(message.anonymousId)},
      ];

      if(properties.email) {
        setEmail.event = "setEmail", 
        setEmail.hash_method = this.hashMethod,
        setEmail.email = this.hashMethod === "md5" ? md5(properties.email) : properties.email;
        finalRequest.push(setEmail);
    }

    if(properties.zipCode) {
        setZipcode.event = "setZipcode", 
        setZipcode.zipCode = properties.zipCode;
        finalRequest.push(setZipcode);
    }

    return finalRequest;
  }

  extraData (rudderElement) {
    const {message} = rudderElement;
    const extraData = {};
    const fieldMapHashmap = getHashFromArray(this.fieldMapping);
    for (var field in fieldMapHashmap) {
      if (fieldMapHashmap.hasOwnProperty(field)) {
          if(message.properties[field]) {
            extraData[fieldMapHashmap[field]] = message.properties[field];
          }
      }
  }
  return extraData;
  }

  page(rudderElement) {

    const { event } = rudderElement.message;

    let finalPayload = handleCommonFields(rudderElement);
    
    if(event === "home" || (this.url === window.location.href)) {

        let homeEvent = {
            "event":"viewHome"
        }
        finalPayload.push(homeEvent);
    } 
    const extraDataObject = extraData(rudderElement)
      if (Object.keys(extraDataObject).length !== 0) {
        finalPayload.push({event : 'setData',extraDataObject});
      }

    window.criteo_q.push(finalPayload);

  }

  track(rudderElement) {
      const { event, properties } = rudderElement.message;

      let finalPayload = handleCommonFields(rudderElement);

    // Product tag 
      if (event === "Product Viewed") {
        viewItemObject = { 
                  event: "viewItem",
                  item: String(properties.product_id),
                  price: properties.price,
                  availability: properties.availability
                };
                if (!viewItemObject.item) {
                  // productId is madatory
                  return;  
                }
          finalPayload.push(viewItemObject);
          
      }

      // Basket/cart tag
      if (event === "Cart Viewed") {
          let productInfo = [];
          let elementaryProduct;
          properties.products.forEach((product) => {
              elementaryProduct = {
                  id : String(product.product_id),
                  price : product.price, 
                  quantity : product.quantity
              }

              if (productInfo.id) {
                // productId is madatory
                productInfo.push(elementaryProduct); 
              } 
              
          });
          viewBasketObject = {
              event: "viewBasket",
              item: productInfo
            };
          finalPayload.push(viewBasketObject);
         
      }
      // sales tag
      if(event === "Order Completed") {
        let productInfo = [];
        let elementaryProduct;
        properties.products.forEach((product) => {
            elementaryProduct = { 
                id: String(product.product_id),
                price : product.price, 
                quantity : product.quantity
            }
            if (elementaryProduct.id) {
              // productId is madatory
              productInfo.push(elementaryProduct); 
            }   
        });
        trackTransactionObject = {
              event: "trackTransaction",
              id: String(properties.order_id),
              new_customer: properties.new_customer,
              deduplication: properties.deduplication,
              item: productInfo
            };
        finalPayload.push(trackTransactionObject);
        
      }

      // Category/keyword search/listing tag
      if (event === "Product List Viewed") {
          let productIdList = [];
          let filterObject = {};
          let viewListObj = {};
          properties.products.forEach((product)=>{
              if(product.product_id) {
                productIdList.push(product.product_id)
              }
          });
          
          if(properties.name && properties.value && (properties.operator && OPERATOR_LIST.includes(properties.operator))) {

            filterObject.name = properties.name;
            filterObject.value = properties.value;
            filterObject.operator = properties.operator;
            viewListObj.filters = [filterObject];
          }

          viewListObj.event = "viewList";
          viewListObj.item = productIdList;
          viewListObj.category = properties.category;
          viewListObj.keywords = properties.keywords;
          viewListObj.page_number = properties.page_number;

        finalPayload.push(viewListObj);

      }
      const extraDataObject = extraData(rudderElement)
      if (Object.keys(extraDataObject).length !== 0) {
        finalPayload.push({event : 'setData',extraData(rudderElement)});
      }
      window.criteo_q.push(finalPayload);

  }


}
export default Criteo;