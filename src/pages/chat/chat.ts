import { ChatService } from './../../providers/chat/chat.service';
import { Chat } from './../../models/chat.model';
import { MessageService } from './../../providers/message/message.service';
import { Observable } from 'rxjs/Observable';
import { Message } from './../../models/message.model';
import { UserService } from './../../providers/user/user.service';
import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth/auth.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;
  
  messages: Observable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  ordemUidChat: boolean;
  private chat1: AngularFireObject<Chat>;
  private chat2: AngularFireObject<Chat>;

  constructor(
      public authService: AuthService, 
      public navCtrl: NavController, 
      public navParams: NavParams,
      public userService: UserService,
      public chatService: ChatService,
      public messageService: MessageService) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad(): void {
    this.recipient = this.navParams.get('recipientUser');

    this.pageTitle = this.recipient.name;

    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => { 
        this.sender = currentUser;

        this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);
        this.chat2 = this.chatService.getDeepChat(this.recipient.$key, this.sender.$key);

        if(this.recipient.photo){
          this.chat1.valueChanges().first().subscribe((chat: Chat) => {
            this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
          });
        }
        
        let doSubscrition = () => {
          this.messages.subscribe((messages: Message[]) => {
            this.scrollToBottom();
          });
        }
        this.messages = this.messageService.getMessages(this.sender.$key, this.recipient.$key);

        this.messages
          .first()
          .subscribe((messages: Message[]) => {
              if(messages.length == 0){
                //Busca ao contrário
                this.messages = this.messageService.getMessages(this.recipient.$key, this.sender.$key);
                this.ordemUidChat = false; 
                doSubscrition();
              }else{
                this.ordemUidChat = true;
                doSubscrition();
              }
          });
      });


  }

  sendMessage(newMessage: string): void {
    if(newMessage){
      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

      this.messageService.create(
        new Message(this.sender.$key, newMessage, currentTimestamp), 
        this.ordemUidChat, 
        this.sender.$key,
        this.recipient.$key)
        .then(() => {
          this.chat1.update({lastMessage: newMessage, timestamp: currentTimestamp });
          this.chat2.update({lastMessage: newMessage, timestamp: currentTimestamp });
        });


    }
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if(this.content){
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
  }

}
