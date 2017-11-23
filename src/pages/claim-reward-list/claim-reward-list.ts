import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {RewardServicesProvider} from '../../providers/reward-services/reward-services';
import {DatabaseProvider} from '../../providers/database/database';
import {UuidProvider} from '../../providers/uuid/uuid';
declare var cordova: any;
import moment from 'moment';
/**
 * Generated class for the ClaimRewardListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-claim-reward-list',
   templateUrl: 'claim-reward-list.html',
 })
 export class ClaimRewardListPage {

   rewards: any;
   store: any;
   storePoint: any;

   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public databaseprovider: DatabaseProvider,
     public alertCtrl: AlertController,
     public uuid: UuidProvider) {
   }

   ionViewDidEnter(){
     this.store = this.navParams.get('store');
     console.log("this.store", this.store);
     // this.store = {
     //   "id":"1db8bc1a-c118-11e7-abc4-cec278b6b50a",
     //   "name":"Store 1",
     //   "address":"Phnom Penh",
     //   "storeTypeName":"FOOD GOLD"
     // };
     this.databaseprovider.getAllRewards().then(data => {
       this.rewards = data;
     });
     this.databaseprovider.getStoreTotalPoints(this.store.id).then(storePoint => {
       this.storePoint = storePoint[0];
       console.log('storePoint ===> ', this.storePoint);
     })
   }

   confirmClaim(reward) {

     let title = '';
     let buttons = [];
     if (reward.points < this.storePoint.total_points){
       title = "ពិន្ទុមិនគ្រប់គ្រាន់";
       buttons = [{
         text: 'បិទ'
       }];
     }
     else{
       title = "ប្តូរយករង្វាន់នេះ?";
       buttons = [{
         text: 'ទេ',
         handler: () => {
           console.log('Disagree clicked');
         }
       }, {
         text: 'យល់ព្រម',
         handler: () => {
           console.log('Agree clicked');
           let data = {
             id: this.uuid.get(),
             status: 1,
             imageUrl: '',
             points: reward.points,
             claimedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
             deliveriedAt: '',
             uploaded: false,
             storeIdStoresRewards: this.store.id,
             rewardIdStoresRewards: reward.id
           };
           this.databaseprovider.addStoreReward(
             data.id,
             data.status,
             data.imageUrl,
             data.points,
             data.claimedAt,
             data.deliveriedAt,
             data.uploaded,
             data.storeIdStoresRewards,
             data.rewardIdStoresRewards
             ).then((results) => {
               console.log(results);
               this.navCtrl.pop();
             });
             // this.navCtrl.parent.select(1);
           }
         }];
       }

       let confirm = this.alertCtrl.create({
         title: title,
         buttons: buttons
       });

       confirm.present();
     }



     pathForImage(img) {
       if (img === null) {
         return '';
       } else {
         return cordova.file.dataDirectory + img;
       }
     }
   }
