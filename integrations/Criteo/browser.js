/* eslint-disable no-unused-expressions */

import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { handleCommonFields, generateExtraData } from "./utils";

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
      logger.debug("Account ID missing");
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

  page(rudderElement) {
    const { name, properties } = rudderElement.message;

    const finalPayload = handleCommonFields(rudderElement, this.hashMethod);

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
      logger.debug("Home page is not detected");
      return;
    }

    const extraDataObject = generateExtraData(rudderElement, this.fieldMapping);
    if (Object.keys(extraDataObject).length !== 0) {
      finalPayload.push({ ...this.extraDataEvent, ...extraDataObject });
    }

    window.criteo_q.push(finalPayload);

    // Final example payload supported by destination
    // window.criteo_q.push(
    //   { event: "setAccount", account: YOUR_PARTNER_ID},
    //   {
    //     event: "setEmail",
    //     email: "##Email Address##",
    //     hash_method: "##Hash Method##",
    //   },
    //   { event: "setSiteType", type: deviceType},
    //   { event: "setCustomerId", id: "##Customer Id##" },
    //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
    //   { event: "setZipcode", zipcode: "##Zip Code##" },
    //   { event: "viewHome" }
    // );
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    const finalPayload = handleCommonFields(rudderElement);

    if (!event) {
      logger.debug("Event name from track call is missing!!");
      return;
    }

    if (!properties || Object.keys(properties).length === 0) {
      logger.debug(
        "Either properties object is missing or empty in the track call"
      );
      return;
    }

    const eventType = event.toLowerCase().trim();

    // Product tag
    if (eventType === "product viewed") {
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
        logger.debug(
          "product_id is a mandatory field to use Product Tag in criteo"
        );
        return;
      }
      // Final example payload supported by destination
      // window.criteo_q.push(
      //   { event: "setAccount", account: YOUR_PARTNER_ID},
      //   {
      //     event: "setEmail",
      //     email: "##Email Address##",
      //     hash_method: "##Hash Method##",
      //   },
      //   { event: "setSiteType", type: deviceType},
      //   { event: "setCustomerId", id: "##Customer Id##" },
      //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
      //   { event: "setZipcode", zipcode: "##Zip Code##" },
      //   {
      //     event: "viewItem",
      //     item: "##Product ID##",
      //     price: "##price##",
      //     availability: "##Availability##",
      //   }
      // );
    }

    // Basket/cart tag && sales tag
    if (eventType === "cart viewed" || eventType === "order completed") {
      const productInfo = [];
      let elementaryProduct;
      if (properties && properties.products && properties.products.length > 0) {
        properties.products.forEach((product, index) => {
          if (product.product_id && product.price && product.quantity) {
            elementaryProduct = {
              id: String(product.product_id),
              price: parseFloat(product.price),
              quantity: parseInt(product.quantity, 10),
            };
            if (
              !Number.isNaN(parseFloat(elementaryProduct.price)) &&
              !Number.isNaN(parseInt(elementaryProduct.quantity, 10))
            ) {
              // all the above fields are mandatory
              productInfo.push(elementaryProduct);
            }
          } else {
            logger.debug(
              `product at index ${index} is skipped for insufficient information`
            );
          }
        });
        if (productInfo.length === 0) {
          logger.debug(
            "None of the products had sufficient information or information is wrongly formatted"
          );
          return;
        }
      } else {
        logger.debug(
          "Payload should consist of at least one product information"
        );
        return;
      }
      if (eventType === "cart viewed") {
        const viewBasketObject = {
          event: "viewBasket",
          item: productInfo,
        };
        finalPayload.push(viewBasketObject);
        // final example payload supported by the destination
        // window.criteo_q.push(
        //   { event: "setAccount", account: YOUR_PARTNER_ID},
        //   {
        //     event: "setEmail",
        //     email: "##Email Address##",
        //     hash_method: "##Hash Method##",
        //   },
        //   { event: "setSiteType", type: deviceType},
        //   { event: "setCustomerId", id: "##Customer Id##" },
        //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
        //   { event: "setZipcode", zipcode: "##Zip Code##" },
        //   {
        //     event: "viewBasket",
        //     item: [
        //       {
        //         id: "##Product Id##",
        //         price: "##Price##",
        //         quantity: "##Quantity##",
        //       },
        //       // add a line for each additional line in the basket
        //     ],
        //   }
        // );
      }

      if (eventType === "order completed") {
        const trackTransactionObject = {
          event: "trackTransaction",
          id: String(properties.order_id),
          item: productInfo,
        };
        if (!trackTransactionObject.id) {
          logger.debug("order_id (Transaction Id) is a mandatory field");
          return;
        }
        if (properties.new_customer === 1 || properties.new_customer === 0) {
          trackTransactionObject.new_customer = properties.new_customer;
        }
        if (properties.deduplication === 1 || properties.deduplication === 0) {
          trackTransactionObject.deduplication = properties.deduplication;
        }
        finalPayload.push(trackTransactionObject);

        // final example payload supported by destination
        //   window.criteo_q.push(
        //     { event: "setAccount", account: YOUR_PARTNER_ID},
        //     { event: "setEmail", email: "##Email Address##", hash_method: "##Hash Method##" },
        //     { event: "setSiteType", type: deviceType},
        //     { event: "setCustomerId", id: "##Customer Id##" },
        //     { event: "setRetailerVisitorId", id: "##Visitor Id##"},
        //     { event: "setZipcode", zipcode: "##Zip Code##" },
        //     { event: "trackTransaction",
        //       id: "##Transaction ID##",
        //       new_customer: ##New Customer##,
        //       deduplication: ##Deduplication##,
        //       item: [
        //        {id: "##Product Id##", price: "##Price##", quantity: "##Quantity##" }
        //        //add a line for each additional line in the basket
        //      ]}
        //   );

        // }
      }
      // Category/keyword search/listing tag
      if (eventType === "product list viewed") {
        const productIdList = [];
        const filterArray = [];
        const viewListObj = {};

        if (properties.product && properties.product.length > 0) {
          properties.products.forEach((product) => {
            if (product.product_id) {
              productIdList.push(String(product.product_id));
            }
          });
          if (productIdList.length === 0) {
            logger.debug("None of the product information had product_id");
            return;
          }
        } else {
          logger.debug(
            "The payload should consist of atleast one product information"
          );
          return;
        }

        viewListObj.event = "viewList";
        viewListObj.item = productIdList;
        viewListObj.category = String(properties.category);
        viewListObj.keywords = String(properties.keywords);
        if (
          properties.page_number &&
          !Number.isNaN(parseInt(properties.page_number, 10))
        ) {
          viewListObj.page_number = parseInt(properties.page_number, 10);
        }

        if (properties.filters) {
          properties.filters.forEach((filter) => {
            const filterObject = {};
            if (filter.name) {
              filterObject.name = filter.name;
            }
            if (
              filter.operator &&
              this.OPERATOR_LIST.includes(filter.operator)
            ) {
              filterObject.operator = filter.operator;
            }
            if (filter.value) {
              filterObject.value = filter.value;
            }
            filterArray.push(filterObject);
          });
        }
        if (filterArray.length > 0) {
          viewListObj.filters = filterArray;
        }
        finalPayload.push(viewListObj);
      }
      const extraDataObject = generateExtraData(
        rudderElement,
        this.fieldMapping
      );
      if (Object.keys(extraDataObject).length !== 0) {
        finalPayload.push({ ...this.extraDataEvent, ...extraDataObject });
      }
      window.criteo_q.push(finalPayload);
      // final example payload supported by destination
      // window.criteo_q.push(
      //   { event: "setAccount", account: YOUR_PARTNER_ID},
      //   { event: "setEmail", email: "##Email Address##", hash_method: "##Hash Method##" },
      //   { event: "setSiteType", type: deviceType},
      //   { event: "setCustomerId", id: "##Customer Id##" },
      //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
      //   { event: "setZipcode", zipcode: "##Zip Code##" },
      //   { event: "viewList",
      //     item: [ "##Product Id 1##", "##Product Id 2##", "##Product Id 3##" ],
      //     category: "##Category Id##",
      //     keywords: "##Search Keyword##",
      //     page_number: ##Page Number##,
      //     filters:[
      //       {name: "#Filter Name#", operator: "#Filter Operator#", value: "#Filter Value#"},
      //       //add a line for each additional filter
      //     ]
      //   }
      // );
    }
  }
}
export default Criteo;
