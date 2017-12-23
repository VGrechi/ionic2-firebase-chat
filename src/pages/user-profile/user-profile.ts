import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth/auth.service';
import { UserService } from './../../providers/user/user.service';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  private filePhoto: File;
  uploadProgress: number;

  constructor(public userService: UserService,
              public authService: AuthService, 
              public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.userService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
  }


  onSubmit(event: Event): void{
    event.preventDefault();

    if(this.filePhoto){
      let uploadTask = this.userService.uploadPhoto(this.filePhoto, this.currentUser.$key);

      uploadTask.on('state_changed', (snapshot: any) => {
        this.uploadProgress = Math.round(((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      }, (error: Error) => {
        //catch Error
      }, () => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });
    }else{
      this.editUser();
    }
  }

  onPhoto(event): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userService.edit({
      name: this.currentUser.name,
      username: this.currentUser.username,
      photo: photoUrl || this.currentUser.photo || ''
    }).then(() => {
      this.canEdit = false;
      this.filePhoto = undefined;
      this.uploadProgress = 0;
    });
  }

}
