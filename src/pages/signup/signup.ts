import { User } from './../../models/user.model';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UserService } from './../../providers/user/user.service';
import { AuthService } from './../../providers/auth/auth.service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { HomePage } from './../home/home';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(
    public authService: AuthService,
    public loadingCrtl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: UserService) {

      let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      this.signupForm = this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.compose([Validators.required, Validators.pattern(emailRegex)])]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      });

  }

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username: string = formUser.username;

    this.userService.userExists(username)
      .first()
      .subscribe((users: User[]) => {
        if(users.length > 0){
          this.showAlert(`O username ${username} já está sendo usado por outra conta!`);
          loading.dismiss();
        }else{
          console.log("Cadastrando usuário..");
          this.authService.createAuthUser( {email: formUser.email, password: formUser.password} )
            .then((nuser: any)=> {
      
              delete formUser.password;
              let uuid: string = nuser.uid;
      
              //Se criou a autenticação, então insere no banco de dados.
              this.userService.create(formUser, uuid)
                .then(() => {
                  this.navCtrl.setRoot(HomePage);
                  loading.dismiss();
                }).catch((error: any) => {
                  console.log(error);
                  loading.dismiss();
                  this.showAlert(error);
                }); 
      
            }).catch((error: any) => {
              console.log(error);
              loading.dismiss();
              this.showAlert(error);
            });

        }
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
}

