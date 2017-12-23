import { SigninPage } from './../pages/signin/signin';
import { App, AlertController, MenuController, NavController } from 'ionic-angular';
import { AuthService } from './../providers/auth/auth.service';
import { OnInit } from '@angular/core';

export abstract class BaseComponent implements OnInit {

    protected navCtrl: NavController;

    constructor(
        public authService: AuthService,
        public alertCtrl: AlertController,
        public app: App,
        public menuCtrl: MenuController
    ) {}

    ngOnInit(){
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(){
       
        this.alertCtrl.create({
            message: 'Do you want to quit?',
            buttons: [{
                text: 'Yes',
                handler: () => {
                    console.log("OnLogout() Base Component");
                    this.authService.logout().then(() => { this.navCtrl.setRoot(SigninPage) });
                    this.menuCtrl.enable(false, 'user-menu');
                }
            },
            {
                text: 'No'
            }]
        }).present();
    }
}