import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { SignupPage } from './../signup/signup';

import { AuthService } from './../../providers/auth/auth.service';
import { UserService } from './../../providers/user/user.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signinForm: FormGroup;

  constructor(
    public authService: AuthService,
    public loadingCrtl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: UserService) {

      let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      this.signinForm = this.formBuilder.group({
        email: new FormControl('', [Validators.compose([Validators.required, Validators.pattern(emailRegex)])]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      });

  }

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let formUser = this.signinForm.value;

    this.authService.signinWithEmail(formUser)
      .then((isLogged: boolean) => {

        if(isLogged){
          this.navCtrl.setRoot(HomePage)
            .then((hasAcess: boolean) => {
              console.log("Autorizado: ", hasAcess);
            })
            .catch(err => {
              console.log("Não Autorizado: ", err);
            });;
        }

      }).catch((error: any) => {
        console.log(error);
        loading.dismiss();
        this.showAlert(error);
      });
    
  }
    
  private showLoading(): Loading {
    let loading: Loading = this.loadingCrtl.create({
      content: 'Please wait...'
    });
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']   
    }).present();
  }

  onSignup(): void {
    this.navCtrl.push(SignupPage)
      .then((hasAcess: boolean) => {
        console.log("Autorizado: ", hasAcess);
      })
      .catch(err => {
        console.log("Não Autorizado: ", err);
      });
  }

}
