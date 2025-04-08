/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RudderAnalyticsService } from './use-rudder-analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sample-app';
  routerEventSubscription: Subscription | undefined;

  constructor(private _router: Router, private rudderAnalyticsService: RudderAnalyticsService) {}
  
  async ngOnInit() {
    this.routerEventSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.rudderAnalyticsService.getAnalytics()?.page(event.url);
      }
    });
  }

  page() {
    this.rudderAnalyticsService.getAnalytics()?.page(
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
    this.rudderAnalyticsService.getAnalytics()?.identify(
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
    this.rudderAnalyticsService.getAnalytics()?.track(
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
    this.rudderAnalyticsService.getAnalytics()?.group(
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
    this.rudderAnalyticsService.getAnalytics()?.alias('alias-user-id', () => {
      console.log('alias call');
    });
  }

  public ngOnDestroy(): void {
    this.routerEventSubscription?.unsubscribe();
  }
}
