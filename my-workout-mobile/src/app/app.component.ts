import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonRouterOutlet,
    IonApp,
    NavbarComponent
  ],
  styleUrls: ['app.component.scss']

})
export class AppComponent {
  constructor() {}
}
