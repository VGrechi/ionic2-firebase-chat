import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chat } from './../../models/chat.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireObject } from 'angularfire2/database/interfaces';

@Injectable()
export class ChatService extends BaseService {

  chats: Observable<Chat[]>;

  constructor(public af: AngularFireDatabase, 
              public firebaseAuth: AngularFireAuth,
              public http: HttpClient) {
    super();
    this.setChats();
  }

  private setChats(): void {
    this.firebaseAuth.authState
      .subscribe((authState: firebase.User) => {
        if(authState){

          this.chats = this.mapListKeys<Chat>(
                           this.af.list<Chat>(`/chats/${authState.uid}`, (ref: firebase.database.Reference) => ref.orderByChild('timestamp')))
                            .map((chats: Chat[]) => {
                              return chats.reverse();
                            }).catch(this.handleObservableError);

        }
    });
  }

  create(chat: Chat, userId1: string, userId2: string): Promise<void> {
    return this.af.object(`/chats/${userId1}/${userId2}`)
              .set(chat)
              .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): AngularFireObject<Chat> {
    return this.af.object(`/chats/${userId1}/${userId2}`);
  }

  updatePhoto(chat: AngularFireObject<Chat>, chatPhoto: string, recipientUserPhoto: string): Promise<boolean> {
    if(chatPhoto != recipientUserPhoto){
      return chat.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(true);
  }

}
