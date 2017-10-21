import { Component} from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController, ViewController, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {StoreImagesProvider} from '../../providers/store-images/store-images';
import {StoreModalComponent} from '../../components/store-modal/store-modal';

import { Storage } from '@ionic/storage';

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
   isReadyToSave: boolean;
   imgSrc1: String;
   imgSrc2: String;
   imgData1: String;
   imgData2: String;
   storeId: any;
   storeImageUrl: any;
   store: any;
   points: any = 0;
   randomString: String;

   storeDisplays: any[];


   alerts = [];


   constructor(public navCtrl: NavController,
     public alertCtrl: AlertController,
     public navParams: NavParams,
     public storePointsServices: StorePointServicesProvider,
     public storeImage: StoreImagesProvider,
     public modalCtrl: ModalController,
     ) {

   }


   ionViewDidLoad() {

     this.storePointsServices.getStorePoints().subscribe((data)=> {
       console.log('Store Points', data);
     });
     // this.storeId = this.navParams.data.item.STORE.id;
     this.storeId = 1;
     this.storeImage.getStoreImage(this.storeId).subscribe((store)=>{
       this.storeImageUrl = 'http://' + store.imageUrl;
       this.store = store;
       console.log('store', this.store);
     });

     this.storeDisplays = [
     {
       uId: Math.random().toString(36).substr(2, 5),
       displayId: 1,
       imageUrl: '../../assets/img/u1.jpg',
       name: 'ឈុត២ជួរ',
       points: 3600
     },
     {
       uId: Math.random().toString(36).substr(2, 5),
       displayId: 2,
       imageUrl: '../../assets/img/u2.jpg',
       name: 'ឈុត៣ជួរ',
       points: 1800
     }
     ];
   }


   remove(uId){
     // console.log('remove card');

     const index = this.storeDisplays.findIndex(sd => sd.uId == uId);
     console.log('uId', uId);
     console.log('index', index);
     this.storeDisplays.splice(index, 1);
   }

   showStoraModal(){
     let modal = this.modalCtrl.create(StoreModalComponent, {userId: '112'});
     modal.onDidDismiss((data) => {
       console.log('dismiss', data);
       if (data){
         this.storeDisplays.push({
           uId: Math.random().toString(36).substr(2, 5),
           displayId: 3,
           imageUrl: data.imageUrl,
           name: 'ឈុតទី៥',
           points: data.points
         });
       }
     });
     modal.present();
   }

 }

