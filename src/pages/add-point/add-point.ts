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
   }


   removeCard(id){
     console.log('remove card');
   }

   showStoraModal(){
      let modal = this.modalCtrl.create(StoreModalComponent, {userId: '112'});
      modal.onDidDismiss((data) => {
        console.log('dismiss', data);
      });
      modal.present();
   }


   // processWebImage(event) {
   //   console.log('img2');
   //   let reader = new FileReader();
   //   reader.onload = (readerEvent) => {

   //     let imageData = (readerEvent.target as any).result;
   //     this.imgSrc2 = imageData;

   //   };

   //   reader.readAsDataURL(event.target.files[0]);
   // }

   // getPicture() {
   //   if (Camera['installed']()) {
   //     this.camera.getPicture({
   //       destinationType: this.camera.DestinationType.DATA_URL,
   //       quality: 50
   //     }).then((data) => {
   //       this.imgSrc1 = 'data:image/jpg;base64,' + data;
   //     }, (err) => {
   //       alert('Unable to take photo');
   //     })
   //   } else {
   //     this.imageFile1.nativeElement.click();
   //   }
   // }



   // save(){
   //   this.imgData1 = this.imgSrc1.substr(this.imgSrc1.indexOf('base64,') + 'base64,'.length);
   //   this.imgData2 = this.imgSrc2.substr(this.imgSrc2.indexOf('base64,') + 'base64,'.length);

   //   let data = {
   //     points: 2000,
   //     imageUrl: this.imgData1,
   //     storeIdStorePoints: 1,
   //     userIdStorePoints: 1,
   //     displayIdStorePoints: 1
   //   };

   //   this.storePointsServices.createStorePoints(data).subscribe((data)=> {
   //     console.log('Store Points', data);
   //   });
   //   //this.navCtrl.setPages([
   //   //{ page: HomePage }
   //   //]);
   // }

 }


// @Component({
//   selector: 'take-picture-modal',
//   templateUrl: 'take-picture-modal.html'
// })

// export class TakePictureModal {

//   constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController) {

//   }

//   dismiss(){
//     this.viewCtrl.dismiss();
//   }

// }
