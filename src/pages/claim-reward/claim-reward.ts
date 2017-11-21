import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {DatabaseProvider} from '../../providers/database/database';
/**
 * Generated class for the ClaimRewardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-claim-reward',
   templateUrl: 'claim-reward.html',
 })
 export class ClaimRewardPage {

   store: any;
   storePoint: any;
   storeRewards: any;
   points: any;
   remainingPoints: any;
   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public alertCtrl: AlertController,
     public databaseprovider: DatabaseProvider) {

   }

   ionViewDidEnter() {
     this.store = this.navParams.get('store');
     // this.store = {
     //   "id":"1db8bc1a-c118-11e7-abc4-cec278b6b50a",
     //   "name":"Store 1",
     //   "address":"Phnom Penh",
     //   "storeTypeName":"FOOD GOLD"
     // };

     this.databaseprovider.getStoreTotalPoints(this.store.id).then(storePoint => {
       this.storePoint = storePoint[0];
     })

     this.databaseprovider.getStoreRewards(this.store.id).then(storeRewards => {
       console.log('Store Rewards ===> ', storeRewards);
       this.storeRewards = storeRewards;
     })

     this.databaseprovider.getRemainingPoint(this.store.id).then(points => {
       console.log('REMAINING POINTS =====>', points);
       this.points = points[0];
       this.remainingPoints = this.points.earnedPoints - this.points.spentPoints;
     })

   }

   goToClaimRewardDetail(storeReward){
     this.navCtrl.push('ClaimRewardDetailPage', {
       storeReward: storeReward
     });
   }

   goToClaimRewardList(){
     this.navCtrl.push('ClaimRewardListPage', {
       store: this.store
     });
   }


 }
