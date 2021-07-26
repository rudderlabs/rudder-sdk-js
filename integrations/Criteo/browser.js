/* eslint-disable no-unused-expressions */
import md5 from "md5";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Criteo {
  constructor(config) {
    this.name = "Criteo";
    this.hash_method = config.hashMethod;
    this.accountId = config.accountId;
    this.url = config.homePageUrl;
    // eslint-disable-next-line no-nested-ternary
    this.deviceType = /iPad/.test(navigator.userAgent)
      ? "t"
      : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(
          navigator.userAgent
        )
      ? "m"
      : "d";
    this.fieldMapping = config.fieldMapping;
    this.OPERATOR_LIST = ["eq", "gt", "lt", "ge", "le", "in"];
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
    window.criteo_q.push({ event: "setAccount", account: this.accountId });
    window.criteo_q.push({ event: "setSiteType", type: this.deviceType });
  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    logger.debug("in Criteo isLoaded");
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug("in Criteo isReady");
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  handleCommonFields(rudderElement) {
    const { message } = rudderElement;
    const { properties } = message;

    const setEmail = {};
    const setZipcode = {};

    const finalRequest = [
      { event: "setCustomerId", id: md5(message.userId) },
      { event: "setRetailerVisitorId", id: md5(message.anonymousId) },
    ];

    if (properties.email) {
      setEmail.event = "setEmail";
      setEmail.hash_method = this.hashMethod;
      setEmail.email =
        this.hashMethod === "md5" ? md5(properties.email) : properties.email;
      finalRequest.push(setEmail);
    }

    if (properties.zipCode) {
      setZipcode.event = "setZipcode";
      setZipcode.zipCode = properties.zipCode || properties.zip;
      finalRequest.push(setZipcode);
    }

    return finalRequest;
  }

  // extraData (rudderElement) {
  //   const {message} = rudderElement;
  //   const extraData = {};
  //   const fieldMapHashmap = getHashFromArray(this.fieldMapping);
  //   for (var field in fieldMapHashmap) {
  //     if (fieldMapHashmap.hasOwnProperty(field)) {
  //         if(message.properties[field]) {
  //           extraData[fieldMapHashmap[field]] = message.properties[field];
  //         }
  //     }
  // }
  // return extraData;
  // }

  page(rudderElement) {
    const { event } = rudderElement.message;

    const finalPayload = this.handleCommonFields(rudderElement);

    if (event === "home" || (this.url && this.url === window.location.href)) {
      const homeEvent = {
        event: "viewHome",
      };
      finalPayload.push(homeEvent);
    }
    // const extraDataObject = this.extraData(rudderElement)
    //   if (Object.keys(extraDataObject).length !== 0) {
    //     finalPayload.push({event : 'setData',extraDataObject});
    //   }

    window.criteo_q.push(finalPayload);
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    const finalPayload = this.handleCommonFields(rudderElement);

    // Product tag
    if (event === "Product Viewed") {
      const viewItemObject = {
        event: "viewItem",
        item: String(properties.product_id),
        price: properties.price,
        availability: properties.availability,
      };
      if (!viewItemObject.item) {
        // productId is mandatory
        return;
      }
      finalPayload.push(viewItemObject);
    }

    // Basket/cart tag
    if (event === "Cart Viewed") {
      const productInfo = [];
      let elementaryProduct;
      properties.products.forEach((product) => {
        elementaryProduct = {
          id: String(product.product_id),
          price: product.price,
          quantity: product.quantity,
        };

        if (productInfo.id) {
          // productId is madatory
          productInfo.push(elementaryProduct);
        }
      });
      const viewBasketObject = {
        event: "viewBasket",
        item: productInfo,
      };
      finalPayload.push(viewBasketObject);
    }
    // sales tag
    if (event === "Order Completed") {
      const productInfo = [];
      let elementaryProduct;
      properties.products.forEach((product) => {
        elementaryProduct = {
          id: String(product.product_id),
          price: product.price,
          quantity: product.quantity,
        };
        if (elementaryProduct.id) {
          // productId is madatory
          productInfo.push(elementaryProduct);
        }
      });
      const trackTransactionObject = {
        event: "trackTransaction",
        id: String(properties.order_id),
        new_customer: properties.new_customer,
        deduplication: properties.deduplication,
        item: productInfo,
      };
      finalPayload.push(trackTransactionObject);
    }

    // Category/keyword search/listing tag
    if (event === "Product List Viewed") {
      const productIdList = [];
      const filterObject = {};
      const viewListObj = {};
      properties.products.forEach((product) => {
        if (product.product_id) {
          productIdList.push(product.product_id);
        }
      });

      if (
        properties.name &&
        properties.value &&
        properties.operator &&
        this.OPERATOR_LIST.includes(properties.operator)
      ) {
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
    // const extraDataObject = this.extraData(rudderElement)
    // if (Object.keys(extraDataObject).length !== 0) {
    //   let extraDataEvent = {
    //     event : 'setData',extraD
    //   }
    //   finalPayload.push(extend(extraData, { event: 'setData' }));
    // }
    window.criteo_q.push(finalPayload);
  }
}
export default Criteo;
