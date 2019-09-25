import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "todo-app";

  handleClick(event: Event) {
    let analytics = window["analytics"];
    analytics.load("1QbNPCBQp2RFWolFj2ZhXi2ER6a");
    analytics["page"]();
    analytics["track"]();
    console.log("Click!, event");
  }
}
