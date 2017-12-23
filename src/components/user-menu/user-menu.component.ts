import { UserProfilePage } from './../../pages/user-profile/user-profile';
import { AuthService } from './../../providers/auth/auth.service';
import { User } from './../../models/user.model';
import { AlertController, MenuController, App } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';


@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.component.html'
})
export class UserMenuComponent extends BaseComponent {

  @Input('user') currentUser: User;

  constructor(
    public authService: AuthService,
    public alertCtrl: AlertController,
    public app: App,
    public menuCtrl: MenuController
    ) {
      super(authService, alertCtrl, app, menuCtrl);
    }

    onProfile(): void {
      this.navCtrl.push(UserProfilePage);
    }

}
