import { Component } from '@angular/core';
import { IonicPage, ActionSheetController, NavController, NavParams, Platform } from 'ionic-angular';
declare var cordova: any;
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { DatabaseProvider } from './../../providers/database/database';
import moment from 'moment';
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

   storeReward: any;
   store: any;
   imageUrl: any;
   readPlatform;

   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     public camera: Camera,
     private file: File,
     private filePath: FilePath,
     private transfer: Transfer,
     public databaseprovider: DatabaseProvider,
     public platform: Platform,
     public actionSheetCtrl: ActionSheetController,
     ) {
   }

   ionViewDidLoad() {
     this.storeReward = this.navParams.get('storeReward');
     // this.storeReward = {
     //   "id":"68819be8-2ffc-4c21-bef6-eabf271d8307",
     //   "status":1,
     //   "points":30000,
     //   "name":"TV",
     //   "claimedAt":"2017-11-0907:17:28",
     //   "deliveriedAt":"",
     //   "imageUrl": "",
     //   "storeIdStoresRewards": "",
     //   "rewardIdStoresRewards": ""
     // }
     this.imageUrl = null;
     this.store = this.navParams.get('store');

     // this.store = {
     //   "id":"1db8bc1a-c118-11e7-abc4-cec278b6b50a",
     //   "name":"Store 1",
     //   "address":"Phnom Penh",
     //   "storeTypeName":"FOOD GOLD"
     // };
     console.log('storeReward ===> ', this.storeReward);
   }

   backToClaimReward(){
     this.navCtrl.pop();
   }

   deliverReward(){
     this.storeReward.deliveriedAt = moment().format('YYYY-MM-DD hh:mm:ss');
     this.storeReward.status = 2;
     this.storeReward.uploaded = false;
     // this.storeReward.spent_points = 30000;
     console.log('Store Reward', this.storeReward);
     console.log('id ====> ', this.storeReward.id)
     console.log('status ====> ', this.storeReward.status)
     console.log('imageUrl ====> ', this.storeReward.imageUrl)
     console.log('spent_points ====> ', this.storeReward.spent_points)
     console.log('claimedAt ====> ', this.storeReward.claimedAt)
     console.log('deliveriedAt ====> ', this.storeReward.deliveriedAt)
     console.log('uploaded ====> ', this.storeReward.uploaded)
     console.log('storeIdStoresRewards ====> ', this.storeReward.storeIdStoresRewards)
     console.log('rewardIdStoresRewards ====> ', this.storeReward.rewardIdStoresRewards)
     this.databaseprovider.addStoreReward(
       this.storeReward.id,
       this.storeReward.status,
       this.storeReward.imageUrl,
       this.storeReward.spent_points,
       this.storeReward.claimedAt,
       this.storeReward.deliveriedAt,
       this.storeReward.uploaded,
       this.storeReward.storeIdStoresRewards,
       this.storeReward.rewardIdStoresRewards
       ).then((respond) => {
         console.log('UPDATE Deliver Reward ====> ', respond);
       });


     }

     getPicture() {
       if (Camera['installed']()) {
         let actionSheet = this.actionSheetCtrl.create({
           title: 'ជ្រើសរើសប្រភពរូបភាព',
           buttons: [
           {
             text: 'ពីរូបទូរស័ព្ទ',
             handler: () => {
               this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
             }
           },
           {
             text: 'ពីកាមេរ៉ា',
             handler: () => {
               this.takePicture(this.camera.PictureSourceType.CAMERA);
             }
           },
           {
             text: 'បោះបង់',
             role: 'cancel'
           }
           ]
         });
         actionSheet.present();
       }
     }

     public takePicture(sourceType) {

       var options = {
         quality: 50,
         sourceType: sourceType,
         saveToPhotoAlbum: true,
         correctOrientation: true,
         destinationType: this.camera.DestinationType.FILE_URI
       };

       this.camera.getPicture(options).then((imagePath) => {
         if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
           this.readPlatform = 'android';
           this.filePath.resolveNativePath(imagePath)
           .then(filePath => {
             let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
             let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
             this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
           });
         } else {
           this.readPlatform = 'other';
           var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
           var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
           this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
         }
       }, (err) => {
         console.log('Error take picture');
       });
     }

     private createFileName() {
       var d = new Date(),
       n = d.getTime(),
       newFileName =  n + ".jpg";
       return newFileName;
     }

     private copyFileToLocalDir(namePath, currentName, newFileName) {
       this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
         this.storeReward.imageUrl = newFileName;
       }, error => {
         console.log('Error file storing');
       });
     }

     public pathForImage(img) {
       if (img === null) {
         return '';
       } else {
         return cordova.file.dataDirectory + img;
       }
     }

   }
