import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BaseService } from '../base/base.service';

@Injectable()
export class AuthService extends BaseService {

  constructor(
    public auth: AngularFireAuth,    
    public http: HttpClient) {
      super();
  }

  createAuthUser(user: {email: string, password: string}): any {
    return this.auth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  logout(): Promise<any> {
  return this.auth.auth.signOut();
  }

  signinWithEmail(user: {email:string, password: string}): Promise<boolean> {
  return this.auth.auth.signInWithEmailAndPassword(user.email, user.password)
    .then((authState: any) => {
        return authState != null;
    }).catch(this.handlePromiseError);
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      (this.auth.auth.currentUser != null) ? resolve(true) : reject(false);
    });
    
  }

}
