import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RudderAnalyticsService } from './use-rudder-analytics';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [RudderAnalyticsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
