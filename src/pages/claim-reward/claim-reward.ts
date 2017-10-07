import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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

   constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad ClaimRewardPage');
   }

   goToClaimRewardDetail(){
     this.navCtrl.push('ClaimRewardDetailPage', {});
   }

   confirmRecieved(){
     let confirm = this.alertCtrl.create({
       title: 'ពិតជាទទួលបានរង្វាន់?',
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
           // this.navCtrl.parent.select(1);
           // this.navCtrl.setPages([
           //    { page: AboutPage }
           // ]);
         }
       }
       ]
     });
     confirm.present();

   }

 }
