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


   }

   getStorePointSum(storeId){
     this.databaseprovider.getStorePointsSum(storeId).then(data => {
       this.storePoints = data;
     });
   }


   ionViewDidEnter() {
     this.storeId =  this.navParams.data.id;

     this.databaseprovider.getStore(this.storeId).then(data => {
       this.store = data[0];
     });

     this.getStorePointSum(this.storeId);
   }

   pointDetail(storeImage){
     this.navCtrl.push('PointDetailPage', {
       storeImage: storeImage
     });
   }

 }
