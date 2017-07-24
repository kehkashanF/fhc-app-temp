import { HomePage } from './../pages/home/home';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//Native
import { EmailComposer } from '@ionic-native/email-composer';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { BrowserModule } from '@angular/platform-browser';
import { CallNumber } from '@ionic-native/call-number';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player'
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';


// Providers
import { VideosProvider } from '../providers/videos';
import { UserProvider } from '../providers/user';
import { LoaderProvider } from '../providers/loader';
import { VideosService } from './../providers/fav-videos';
import { QuizService } from './../providers/quiz';
import { QuizStoreProvider } from '../providers/quiz-store';

/* Shantanu's modules */
import { Logger } from '../providers/logger';
import { AuthProvider } from '../providers/auth';
import { Keyboard } from '@ionic-native/Keyboard';

/* For Firebase Related */
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { GlobalsProvider } from '../providers/globals/globals';

/* For Downloading files*/
import { Transfer  } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';


/* Firebase config object. Need to make it dynamic. Temp hack*/
const firebaseConfig = {
    apiKey: "AIzaSyAutL08qJ8hTPM2860x-LHEAnDmgDEObRA",
    authDomain: "fhc-ionic-app.firebaseapp.com",
    databaseURL: "https://fhc-ionic-app.firebaseio.com",
    projectId: "fhc-ionic-app",
    storageBucket: "fhc-ionic-app.appspot.com",
    messagingSenderId: "928506390872"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      //for limiting scrolling of the page when keyboard is up
      scrollAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VideosService,
    QuizService,
    VideosProvider,
    EmailComposer,
    InAppBrowser,
    CallNumber,
    Logger,
    AuthProvider,
    AngularFireDatabase,
    Keyboard,
    UserProvider,
    LoaderProvider,
    GlobalsProvider,
    QuizStoreProvider,
    Transfer,
    File,
    YoutubeVideoPlayer
  ]
})
export class AppModule {}
