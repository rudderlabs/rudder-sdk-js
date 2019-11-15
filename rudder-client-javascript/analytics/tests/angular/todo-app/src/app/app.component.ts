import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "todo-app";

  handleClick(event: Event) {
    let rudderanalytics = window["rudderanalytics"];
    console.log("===rudderanalytics===", rudderanalytics);
    //rudderanalytics.load("1QbNPCBQp2RFWolFj2ZhXi2ER6a");

    rudderanalytics.identify(
      {
        name: "demo2",
        city: "Orissa",
        country: "India",
        email: "demo2@gmail.com"
      },
      () => {
        console.log("in identify callback html");
      }
    );

    rudderanalytics.page(
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

    rudderanalytics.track("Article Started", {
      title: "How to Create a Tracking Plan",
      course: "Intro to rudderanalytics",
      revenue: 10
    });

    console.log("Click!, event");
  }
}
