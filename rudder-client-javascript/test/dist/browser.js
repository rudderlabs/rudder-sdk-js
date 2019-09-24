var analytics = (function (exports) {
  'use strict';

  class test {
    constructor() {
      this.prop1 = "val1";
      this.prop2 = "val2";
    }

    page() {
      console.log("page called " + this.prop1);
    }

    track() {
      console.log("track called " + this.prop2);
    }

  }

  let instance = new test();
  let page = instance.page.bind(instance);
  let track = instance.track.bind(instance);

  exports.page = page;
  exports.track = track;

  return exports;

}({}));
