import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';



import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';


import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage, LoginModal } from '../pages/home/home';
import {RewardsPage} from '../pages/rewards/rewards';
import { TabsPage } from '../pages/tabs/tabs';
// import {TakePictureModal} from '../pages/add-point/add-point';
import {StoreModalComponent} from '../components/store-modal/store-modal'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RewardServicesProvider } from '../providers/reward-services/reward-services';
import { StorePointServicesProvider } from '../providers/store-point-services/store-point-services';
import { UserProvider } from '../providers/user/user';
import { UsersStoresProvider } from '../providers/users-stores/users-stores';
import { StoresProvider } from '../providers/stores/stores';
import { StoreImagesProvider } from '../providers/store-images/store-images';
import { DisplaysProvider } from '../providers/displays/displays';
import { DisplayTypesProvider } from '../providers/display-types/display-types';
import { StoreTypesProvider } from '../providers/store-types/store-types';


@NgModule({
  declarations: [
  MyApp,
  AboutPage,
  ContactPage,
  HomePage,
  LoginModal,
  RewardsPage,
  TabsPage,
  StoreModalComponent
  ],
  imports: [
  BrowserModule,
  HttpModule,
  IonicModule.forRoot(MyApp),
  IonicStorageModule.forRoot({
    name: '__mydb',
    driverOrder: ['sqlite', 'websql', 'indexeddb']
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  MyApp,
  AboutPage,
  ContactPage,
  HomePage,
  LoginModal,
  RewardsPage,
  TabsPage,
  StoreModalComponent
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
  StoreImagesProvider,
  File,
  Transfer,
  Camera,
  FilePath,
    DisplaysProvider,
    DisplayTypesProvider,
    StoreTypesProvider
  ]
})
export class AppModule {}
