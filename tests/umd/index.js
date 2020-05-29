import analytics from "rudder-js"
//var rudderanalytics = require("./bundle") //import 

analytics.load("1bTPmdxFNdqRP1ssMCJRUiZMA2M", "http://localhost:8091/",{integrations:{All:false, GA: true, Hotjar: true}})
analytics.setAnonymousId("my-user-id")
analytics.page()
analytics.identify("12345")
analytics.track("my event",{prop1: "val1"}, {integrations: {All: true}})
analytics.alias("new-user-id")