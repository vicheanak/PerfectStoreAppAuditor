import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {StoresProvider} from '../../providers/stores/stores';
import { DatePipe } from '@angular/common';
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
    ) {
    // this.storeId = this.navParams.get('store');
    this.storeId = 1;

    this.stores.getStore(this.storeId).subscribe((store) => {
      this.store = store;
    });

    this.storePointsServices.getStoreEarned(this.storeId).subscribe((data) => {
      console.log('Earned ==> ', data);
      this.storeEarned = data;
    });

    this.storePointsServices.getStoreSpent(this.storeId).subscribe((data) => {
      console.log('Spent ==> ', data);
      this.storeSpent = data;
    });

    this.storePointsServices.getStoreRemaining(this.storeId).subscribe((data) => {
      console.log('Remaining ==> ', data);
      this.storeRemaining = data;
    })

    this.storePointsServices.getStoreSum(this.storeId).subscribe((data) => {
      console.log('store storePoints ==> ', data);
      this.storePoints = data;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreDetailPage');
  }

  pointDetail(){
    this.navCtrl.push('PointDetailPage');
  }

}
