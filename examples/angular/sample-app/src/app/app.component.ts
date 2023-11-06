import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sample-app';

  page() {
    console.log('clicked');
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
