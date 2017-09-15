import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddPointPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-add-point',
   templateUrl: 'add-point.html',
 })
 export class AddPointPage {

   constructor(public navCtrl: NavController, public navParams: NavParams) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad AddPointPage');
   }

   toStoreDetail(){
     this.navCtrl.setPages([
       { page: HomePage }
       ]);
   }

 }
