import { ProgressBarComponent } from './../components/progress-bar/progress-bar.component';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { ChatPage } from '../pages/chat/chat';
import { UserProfilePage } from '../pages/user-profile/user-profile';

import { AuthService } from './../providers/auth/auth.service';
import { UserService } from './../providers/user/user.service';
import { ChatService } from '../providers/chat/chat.service';
import { MessageService } from '../providers/message/message.service';

import { CustomLoggedHeaderComponent } from '../components/custom-logged-header/custom-logged-header.component';
import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { UserMenuComponent } from './../components/user-menu/user-menu.component';
import { CapitalizePipe } from '../pipes/capitalize/capitalize.pipe';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyAMaJYW2My3H4lB-ogf1lJztaN3epOL-9U",
  authDomain: "ionic2-firebase-chat-a999c.firebaseapp.com",
  databaseURL: "https://ionic2-firebase-chat-a999c.firebaseio.com",
  projectId: "ionic2-firebase-chat-a999c",
  storageBucket: "ionic2-firebase-chat-a999c.appspot.com",
  messagingSenderId: "47531398481"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ChatPage,
    UserProfilePage,
    CustomLoggedHeaderComponent,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent,
    CapitalizePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ChatPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    AuthService,
    ChatService,
    MessageService
  ]
})
export class AppModule {}
