import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';



import { Camera } from '@ionic-native/camera';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage, LoginModal } from '../pages/home/home';
import {RewardsPage} from '../pages/rewards/rewards';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RewardServicesProvider } from '../providers/reward-services/reward-services';
import { StorePointServicesProvider } from '../providers/store-point-services/store-point-services';
import { UserProvider } from '../providers/user/user';
import { UsersStoresProvider } from '../providers/users-stores/users-stores';
import { StoresProvider } from '../providers/stores/stores';
import { StoreImagesProvider } from '../providers/store-images/store-images';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginModal,
    RewardsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginModal,
    RewardsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RewardServicesProvider,
    StorePointServicesProvider,
    UserProvider,
    UsersStoresProvider,
    StoresProvider,
    StoreImagesProvider
  ]
})
export class AppModule {}
