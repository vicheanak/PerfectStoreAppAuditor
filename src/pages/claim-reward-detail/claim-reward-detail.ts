import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ClaimRewardDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-claim-reward-detail',
   templateUrl: 'claim-reward-detail.html',
 })
 export class ClaimRewardDetailPage {

   constructor(public navCtrl: NavController, public navParams: NavParams) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad ClaimRewardDetailPage');
   }

   backToClaimReward(){
     this.navCtrl.pop();
   }

 }
