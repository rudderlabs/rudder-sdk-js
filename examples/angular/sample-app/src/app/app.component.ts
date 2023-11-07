import { Component } from '@angular/core';
import { RudderAnalytics } from '@rudderstack/analytics-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sample-app';
  analytics: RudderAnalytics | undefined;

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    if (window.rudderanalytics as RudderAnalytics) {
      return;
    }
    this.analytics = new RudderAnalytics();

    this.analytics.load('<writeKey>', '<dataplaneUrl>');

    this.analytics.ready(() => {
      console.log('We are all set!!!');
    });

    // window.rudderanalytics = analytics;
  }

  page() {
    console.log('clicked');
    this.analytics?.page();
  }
  identify() {
    console.log('clicked');
  }
  track() {
    console.log('clicked');
  }
  group() {
    console.log('clicked');
  }
  alias() {
    console.log('clicked');
  }
}
