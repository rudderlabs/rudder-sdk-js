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

    window.rudderanalytics = this.analytics;
  }

  page() {
    this.analytics?.page(
      'Cart',
      'Cart Viewed',
      {
        path: '/best-seller/1',
        referrer: 'https://www.google.com/search?q=estore+bestseller',
        search: 'estore bestseller',
        title: 'The best sellers offered by EStore',
        url: 'https://www.estore.com/best-seller/1',
      },
      () => {
        console.log('page call');
      },
    );
  }
  identify() {
    this.analytics?.identify(
      'sample-user-123',
      {
        firstName: 'Alex',
        lastName: 'Keener',
        email: 'alex@example.com',
        phone: '+1-202-555-0146',
      },
      () => {
        console.log('identify call');
      },
    );
  }
  track() {
    this.analytics?.track(
      'Order Completed',
      {
        revenue: 30,
        currency: 'USD',
        user_actual_id: 12345,
      },
      () => {
        console.log('track call');
      },
    );
  }
  group() {
    this.analytics?.group(
      'sample_group_id',
      {
        name: 'Apple Inc.',
        location: 'USA',
      },
      () => {
        console.log('group call');
      },
    );
  }
  alias() {
    this.analytics?.alias('alias-user-id', () => {
      console.log('alias call');
    });
  }
}
