import {Component, View} from 'angular2/angular2';

@Component({
  selector: 'db-app'
})
@View({
  template: `<h1>Hello {{ name }}</h1>`
})
// Component controller
export class AppComponent {
  name: string;
  
  constructor() {
    this.
    this.name = 'Alice';
  }
}