import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {RewardServicesProvider} from '../../providers/reward-services/reward-services';
import {DatabaseProvider} from '../../providers/database/database';
declare var cordova: any;

/**
 * Generated class for the RewardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-rewards',
   templateUrl: 'rewards.html',
 })
 export class RewardsPage {

   rewards: any;

   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public alertCtrl: AlertController,
     public rewardServices: RewardServicesProvider,
     public databaseprovider: DatabaseProvider) {

   }

   ionViewDidEnter(){
     this.databaseprovider.getAllRewards().then(data => {
       this.rewards = data;
     });
   }

   showConfirm() {
     let confirm = this.alertCtrl.create({
       title: 'ប្តូរយករង្វាន់នេះ?',
       buttons: [
       {
         text: 'ទេ',
         handler: () => {
           console.log('Disagree clicked');
         }
       },
       {
         text: 'ប្តូរ',
         handler: () => {
           console.log('Agree clicked');
           this.navCtrl.parent.select(1);
           //this.navCtrl.setPages([
           //    { page: AboutPage }
           //]);
         }
       }
       ]
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
