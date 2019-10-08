//not tested completely, will look it later

var analytics = require("test-rudder-node-sdk");

analytics.load("1QbNPCBQp2RFWolFj2ZhXi2ER6a");
analytics.identify(
  {
    name: "Tintin",
    city: "Brussels",
    country: "Belgium",
    email: "tintin@herge.com"
  },
  () => {
    console.log("in identify callback html");
  }
);
analytics.page(
  "Dashboard",
  {
    title: "abc",
    url: "http://abc.com",
    path: "/abc"
  },
  () => {
    console.log("in page callback html");
  }
);
analytics.track("Article Started", {
  title: "How to Create a Tracking Plan",
  course: "Intro to Analytics",
  revenue: 10
});
