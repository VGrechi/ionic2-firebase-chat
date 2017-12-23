import { Message } from './../../models/message.model';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { BaseService } from '../base/base.service';

@Injectable()
export class MessageService extends BaseService {

  constructor(public af: AngularFireDatabase,
              public http: HttpClient) {
              super();
  }

  create(message: Message, ordemUidChat: boolean, userId1: string, userId2: string): firebase.database.ThenableReference {
    let lista: AngularFireList<Message>;
    if(ordemUidChat){
      //Sender para Recipient
      lista = this.af.list<Message>(`/messages/${userId1}-${userId2}`, (ref: firebase.database.Reference) => ref.orderByChild('timestamp'))
    }else{
      lista = this.af.list<Message>(`/messages/${userId2}-${userId1}`, (ref: firebase.database.Reference) => ref.orderByChild('timestamp'))  
    }
    return lista.push(message);
  }

  getMessages(userId1: string, userId2: string): Observable<Message[]> {
    return this.mapListKeys<Message>(this.af.list<Message>(`/messages/${userId1}-${userId2}`, 
            (ref: firebase.database.Reference) => ref.orderByChild('timestamp').limitToLast(30)))
            .catch(this.handleObservableError);
  }

}
