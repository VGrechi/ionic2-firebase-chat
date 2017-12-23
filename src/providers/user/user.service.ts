import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { User } from '../../models/user.model';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BaseService } from '../base/base.service';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireObject } from 'angularfire2/database/interfaces';
import { FirebaseApp } from 'angularfire2';

@Injectable()
export class UserService extends BaseService {

  users: Observable<User[]>;
  currentUser: Observable<User>;
  currentUserFireObject: AngularFireObject<User>;

  constructor(
      public af: AngularFireDatabase,
      public firebaseAuth: AngularFireAuth,
      @Inject(FirebaseApp) public firebaseApp: firebase.app.App,
      public http: HttpClient) {

    super();
    this.listAuthState();
  }

  private setUsers(uidToExclude: string): void {
    this.users = this.mapListKeys<User>(
      this.af.list<User>(`/users`, (ref: firebase.database.Reference) => ref.orderByChild('name'))
    )
    .map((users: User[]) => {      
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
  }

  private listAuthState(): void {
    this.firebaseAuth.authState
        .subscribe((authState: firebase.User) => {
          if(authState){
            this.currentUser = this.mapObjectKey<User>(this.af.object<User>(`/users/${authState.uid}`));
            this.currentUserFireObject = this.af.object<User>(`/users/${authState.uid}`);
            this.setUsers(authState.uid);
          }
   });
  }

  create(user: User, uuid: string): Promise<void> {
    return this.af.object(`/users/${uuid}`)
            .set(user)
            .catch(this.handlePromiseError);
  }

  edit(user: {name: string, username: string, photo: string}): Promise<void>{
    return this.currentUserFireObject
            .update(user)
            .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<User[]> {
    return this.mapListKeys<User>(this.af
            .list<User>(`/users`,  (ref: firebase.database.Reference) => ref.orderByChild('username').equalTo(username)));
  }

  get(userId: string): Observable<User> {
    return this.mapObjectKey<User>(this.af.object<User>(`/users/${userId}`))
               .catch(this.handleObservableError);
  }

  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp.storage().ref().child(`/users/${userId}`).put(file);
  }

}
