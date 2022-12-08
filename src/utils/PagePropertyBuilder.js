const RudderProperty = require("./RudderProperty");
// Class for building the "page" message payload
class PagePropertyBuilder {
  constructor() {
    this.title = "";
    this.url = "";
    this.path = "";
    this.referrer = "";
    this.search = "";
    this.keywords = "";
  }

  // Build the core constituents of the payload
  build() {
    if (!this.url || this.url.length === 0) {
      throw new Error("Page url cannot be null or empty");
    }
    const pageProperty = new RudderProperty();
    pageProperty.setProperty("title", this.title);
    pageProperty.setProperty("url", this.url);
    pageProperty.setProperty("path", this.path);
    pageProperty.setProperty("referrer", this.referrer);
    pageProperty.setProperty("search", this.search);
    pageProperty.setProperty("keywords", this.keywords);
    return pageProperty;
  }

  // Setter methods to align with Builder pattern

  setTitle(title) {
    this.title = title;
    return this;
  }

  setUrl(url) {
    this.url = url;
    return this;
  }

  setPath(path) {
    this.path = path;
    return this;
  }

  setReferrer(referrer) {
    this.referrer = referrer;
    return this;
  }

  setSearch(search) {
    this.search = search;
    return search;
  }

  setKeywords(keywords) {
    this.keywords = keywords;
    return this;
  }
}

module.exports = {
  PagePropertyBuilder,
};
