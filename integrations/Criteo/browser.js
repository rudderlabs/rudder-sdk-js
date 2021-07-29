/* eslint-disable no-unused-expressions */
import md5 from "md5";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { getHashFromArray } from "../utils/commonUtils";

class Criteo {
  constructor(config) {
    this.name = "Criteo";
    this.hashMethod = config.hashMethod;
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
    this.extraDataEvent = {
      event: "setData",
    };
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

    if (properties && properties.email) {
      const email = properties.email.trim().toLowerCase();
      setEmail.event = "setEmail";
      setEmail.hash_method = this.hashMethod;
      setEmail.email = this.hashMethod === "md5" ? md5(email) : email;
      finalRequest.push(setEmail);
    }

    if (properties && properties.zipCode) {
      setZipcode.event = "setZipcode";
      setZipcode.zipCode = properties.zipCode || properties.zip;
      finalRequest.push(setZipcode);
    }

    return finalRequest;
  }

  extraData(rudderElement) {
    const { message } = rudderElement;
    const extraData = {};
    const fieldMapHashmap = getHashFromArray(this.fieldMapping);
    let field;
    // eslint-disable-next-line no-restricted-syntax
    for (field in fieldMapHashmap) {
      if (Object.prototype.hasOwnProperty.call(fieldMapHashmap, field)) {
        if (message.properties[field]) {
          extraData[fieldMapHashmap[field]] = message.properties[field];
        }
      }
    }
    return extraData;
  }

  page(rudderElement) {
    const { name, properties } = rudderElement.message;

    const finalPayload = this.handleCommonFields(rudderElement);

    if (
      name === "home" ||
      (properties && properties.name === "home") ||
      (this.url && this.url === window.location.href) ||
      (properties && properties.url === this.url)
    ) {
      const homeEvent = {
        event: "viewHome",
      };
      finalPayload.push(homeEvent);
    } else {
      return;
    }

    const extraDataObject = this.extraData(rudderElement);
    if (Object.keys(extraDataObject).length !== 0) {
      finalPayload.push({ ...this.extraDataEvent, ...extraDataObject });
    }

    window.criteo_q.push(finalPayload);
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    const finalPayload = this.handleCommonFields(rudderElement);

    if (!properties || Object.keys(properties).length === 0) {
      return;
    }

    // Product tag
    if (event === "Product Viewed") {
      if (properties.product_id) {
        const viewItemObject = {
          event: "viewItem",
          item: String(properties.product_id),
        };

        if (properties.price && !Number.isNaN(parseFloat(properties.price))) {
          viewItemObject.price = parseFloat(properties.price);
        }

        if (
          properties.availability &&
          (properties.availability === 1 || properties.availability === 0)
        ) {
          viewItemObject.availability = properties.availability;
        }
        finalPayload.push(viewItemObject);
      } else {
        return;
      }
    }

    // Basket/cart tag && sales tag
    if (event === "Cart Viewed" || event === "Order Completed") {
      const productInfo = [];
      let elementaryProduct;
      if (properties && properties.products && properties.products.length > 0) {
        properties.products.forEach((product) => {
          elementaryProduct = {
            id: String(product.product_id),
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity, 10),
          };

          if (
            elementaryProduct.id &&
            elementaryProduct.price &&
            !Number.isNaN(parseFloat(elementaryProduct.price)) &&
            elementaryProduct.quantity &&
            !Number.isNaN(parseInt(elementaryProduct.quantity, 10))
          ) {
            // all the above fields are mandatory
            productInfo.push(elementaryProduct);
          }
        });
      } else {
        return;
      }
      if (event === "Cart Viewed") {
        if (productInfo.length > 0) {
          const viewBasketObject = {
            event: "viewBasket",
            item: productInfo,
          };
          finalPayload.push(viewBasketObject);
        } else {
          return;
        }
      }

      if (event === "Order Completed") {
        if (!properties) {
          return;
        }
        const trackTransactionObject = {
          event: "trackTransaction",
          id: String(properties.order_id),
          item: productInfo,
        };
        if (!trackTransactionObject.id) {
          logger.error("order_id (Transaction Id) is a mandatory field");
          return;
        }
        if (properties.new_customer === 1 || properties.new_customer === 0) {
          trackTransactionObject.new_customer = properties.new_customer;
        }
        if (properties.deduplication === 1 || properties.deduplication === 0) {
          trackTransactionObject.deduplication = properties.deduplication;
        }
        finalPayload.push(trackTransactionObject);
      }
    }
    // Category/keyword search/listing tag
    if (event === "Product List Viewed") {
      if (!properties) {
        return;
      }
      const productIdList = [];
      const filterObject = {};
      const viewListObj = {};

      if (properties.product && properties.product.length > 0) {
        properties.products.forEach((product) => {
          if (product.product_id) {
            productIdList.push(String(product.product_id));
          }
        });
      } else {
        return;
      }

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
      if (productIdList.length > 0) {
        viewListObj.item = productIdList;
      } else {
        // product ID is mandatory
        return;
      }

      viewListObj.category = String(properties.category);
      viewListObj.keywords = String(properties.keywords);
      if (
        properties.page_number &&
        !Number.isNaN(parseInt(properties.page_number, 10))
      ) {
        viewListObj.page_number = parseInt(properties.page_number, 10);
      }

      finalPayload.push(viewListObj);
    }
    const extraDataObject = this.extraData(rudderElement);
    if (Object.keys(extraDataObject).length !== 0) {
      finalPayload.push({ ...this.extraDataEvent, ...extraDataObject });
    }
    window.criteo_q.push(finalPayload);
  }
}
export default Criteo;
