import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth/auth.service';
import { Component, Input } from '@angular/core';
import { App, AlertController, MenuController } from 'ionic-angular';
import { BaseComponent } from '../base.component';


@Component({
  selector: 'custom-logged-header',
  templateUrl: 'custom-logged-header.component.html'
})
export class CustomLoggedHeaderComponent extends BaseComponent {

  @Input() title: string;
  @Input() user: User;

  constructor(
    public authService: AuthService,
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController) {
      
    super(authService, alertCtrl, app, menuCtrl);
  }


}
