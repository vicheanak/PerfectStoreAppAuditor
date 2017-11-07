import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';

import { SQLitePorter } from '@ionic-native/sqlite-porter';


import { DisplayPage } from '../pages/display/display';
import { SettingPage } from '../pages/setting/setting';
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
import { HostNameProvider } from '../providers/host-name/host-name';
import { ConditionsProvider } from '../providers/conditions/conditions';
import { UuidProvider } from '../providers/uuid/uuid';
import { DatabaseProvider } from '../providers/database/database';
import { RegionProvider } from '../providers/region/region';
import { UploadProvider } from '../providers/upload/upload';


@NgModule({
  declarations: [
  MyApp,
  DisplayPage,
  SettingPage,
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
  DisplayPage,
  SettingPage,
  HomePage,
  LoginModal,
  RewardsPage,
  TabsPage,
  StoreModalComponent
  ],
  providers: [
  StatusBar,
  SplashScreen,
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
  SQLite,
  Geolocation,
  FilePath,
  DisplaysProvider,
  DisplayTypesProvider,
  StoreTypesProvider,
  HostNameProvider,
  ConditionsProvider,
  UuidProvider,
  DatabaseProvider,
  SQLitePorter,
    RegionProvider,
    UploadProvider
  ]
})
export class AppModule {}
