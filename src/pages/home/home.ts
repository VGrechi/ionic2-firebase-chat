import { Chat } from './../../models/chat.model';
import { User } from '../../models/user.model';

import { ChatPage } from './../chat/chat';
import { SigninPage } from './../signin/signin';
import { SignupPage } from '../signup/signup';

import { AuthService } from './../../providers/auth/auth.service';
import { ChatService } from './../../providers/chat/chat.service';
import { UserService } from './../../providers/user/user.service';

import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<User[]>;
  chats: Observable<Chat[]>;
  view: string = 'chats';

  constructor(public authService: AuthService,
              public navCtrl: NavController,
              public menuCtrl: MenuController,
              public userService: UserService,
              public chatService: ChatService) {
                
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad(){
    this.chats = this.chatService.chats;
    this.users = this.userService.users;
    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if(searchTerm){
      switch(this.view){
        case 'chats': 
          this.chats = this.chats
          .map((chats: Chat[]) => {
            return chats.filter((chat: Chat) => {
              return (chat.title.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1);
            });
          });
        break;

        case 'users': 
          this.users = this.users
          .map((users: User[]) => {
            return users.filter((user: User) => {
              return (user.name.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1);
            });
          });
        break;
      }
    }

  }

  onChatCreate(recipientUser: User): void {

    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        
        this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)
        .valueChanges()
        .subscribe((chat: Chat) => {
          if(chat === null){
            let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;
  
            let chat1 = new Chat('', timestamp, recipientUser.name, '');
            this.chatService.create(chat1, currentUser.$key, recipientUser.$key);
  
            let chat2 = new Chat('', timestamp, currentUser.name, '');
            this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
          }
        });

      });
      
    this.navCtrl.push(ChatPage, {
      recipientUser:recipientUser
    });
  }

  onChatOpen(chat: Chat): void {
    let recipientUserId: string = chat.$key;

    this.userService.get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });
      })
  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  onLogout(): void {
    this.authService.logout()
      .then(() => {
        this.navCtrl.setRoot(SigninPage);
      });

  }

}
