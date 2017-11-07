import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {StoresProvider} from '../../providers/stores/stores';
import { DatePipe } from '@angular/common';
import { DatabaseProvider } from './../../providers/database/database';
declare var cordova: any;
/**
 * Generated class for the StoreDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-store-detail',
   templateUrl: 'store-detail.html',
 })
 export class StoreDetailPage {
   storePoints: any[];
   storeId: any;
   store: any;
   storeSpent: any;
   storeEarned: any;
   storeRemaining: any;

   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public stores: StoresProvider,
     public storePointsServices: StorePointServicesProvider,
     private databaseprovider: DatabaseProvider,
     ) {
     // this.storeId = this.navParams.get('store');
     // this.storeId = 1;
     this.storeId =  this.navParams.data.id;

     this.databaseprovider.getStore(this.storeId).then(data => {
       this.store = data[0];
       console.log('GET_STORE ==> ', this.store);
     });


     this.databaseprovider.getStorePointsSum(this.storeId).then(data => {
       this.storePoints = data;
       console.log('GET_StorePointsSum ==> ', this.storePoints);
     });

   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad StoreDetailPage');
   }

   pointDetail(id){
     this.navCtrl.push('PointDetailPage', {id: id});
   }

 }
