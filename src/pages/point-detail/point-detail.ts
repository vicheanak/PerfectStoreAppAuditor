import { Component, ViewChild} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  ViewController,
  ModalController,
  ToastController,
  LoadingController,
  Platform,
  Loading } from 'ionic-angular';

  import { Camera } from '@ionic-native/camera';
  import { File } from '@ionic-native/file';
  import { Transfer, TransferObject } from '@ionic-native/transfer';
  import { FilePath } from '@ionic-native/file-path';

  import { HomePage } from '../home/home';
  import { StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
  import { StoreImagesProvider } from '../../providers/store-images/store-images';
  import { StoreModalComponent } from '../../components/store-modal/store-modal';
  import { StoreTypesProvider } from '../../providers/store-types/store-types';
  import { DisplayTypesProvider } from '../../providers/display-types/display-types';
  import { DisplaysProvider } from '../../providers/displays/displays';
  import { StoresProvider } from '../../providers/stores/stores';
  import { Storage } from '@ionic/storage';
  declare var cordova: any;
  import {Observable} from 'rxjs/Rx';
  import {Http, Response} from '@angular/http';
  import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
  import {HostNameProvider} from '../../providers/host-name/host-name';
  import moment from 'moment';
  import { DatabaseProvider } from './../../providers/database/database';
  import {UuidProvider} from '../../providers/uuid/uuid';

/**
 * Generated class for the AddPointPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-point-detail',
   templateUrl: 'point-detail.html',
 })
 export class PointDetailPage {
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
   isNew: boolean;
   displayTypesArr: any;
   storeTypesArr: any;
   displaysArr: any;
   selectedDisplayType: any;
   selectedDisplay: any;
   imageUrl: any;
   readPlatform;
   loading: Loading;
   user: any;


   tp: any;
   url:any;
   op: any;
   storePointsList: any;
   storeImageId: any;

   storeDisplays: any[];

   alerts = [];
   storePoint: any;
   storeImageObj: any;

   storePointId: any;

   successMsg1: any;
   successMsg2: any;
   successMsg3: any;

   storeImages: any = [];
   storePoints: any = [];


   spid: any;
   spuuid: any;
   sppoints: any;
   spimageUrl: any;
   spuploaded: any;
   spstoreIdStorePoints: any;
   spuserIdStorePoints: any;
   spdisplayIdStorePoints: any;
   spstoreImageIdStorePoints: any;
   spconditionIdStorePoints: any;
   lat: any;
   lng: any;
   storeImageParam: any;


   constructor(public navCtrl: NavController,
     public alertCtrl: AlertController,
     public navParams: NavParams,
     public storePointsServices: StorePointServicesProvider,
     public storeImage: StoreImagesProvider,
     public modalCtrl: ModalController,
     public storage: Storage,
     public storeTypes: StoreTypesProvider,
     public displays: DisplaysProvider,
     public displayTypes: DisplayTypesProvider,
     public actionSheetCtrl: ActionSheetController,
     public stores: StoresProvider,
     public camera: Camera,
     public viewCtrl: ViewController,
     public toastCtrl: ToastController,
     public loadingCtrl: LoadingController,
     public platform: Platform,
     private file: File,
     private filePath: FilePath,
     private transfer: Transfer,
     public http: Http,
     private _sanitizer: DomSanitizer,
     private hostname: HostNameProvider,
     public databaseprovider: DatabaseProvider,
     public uuid: UuidProvider
     ) {
     // this.storage.clear();
     this.storeDisplays = [];
   }



   ionViewDidEnter(){
     this.storeImageParam = this.navParams.data.storeImage;


     this.storeData();

     this.storage.get('userdata').then((userdata) => {
       if (userdata){
         this.user = JSON.parse(userdata);
       }
     });

     this.databaseprovider.getAllStorePoints().then((data) => {
       this.storePoints = data;
     });

     console.log('VIEW POINT DETAIL ENTER', this.storeImageParam);
     this.databaseprovider.getStoreImage(this.storeImageParam.storeImageId).then((data) => {
       this.storeImageObj = data[0];
       this.imageUrl = this.storeImageObj.imageUrl;
     });
   }

   storeData(){
     console.log('=========> this.storeImageParam.storeImageId ', this.storeImageParam.storeImageId);
     this.storage.get('storeTypes').then((storeTypes) => {
       this.storage.get('displayTypes').then((displayTypes)=>{
         this.storage.get('displays').then((displays) => {
           this.databaseprovider.getStorePointByStoreImage(this.storeImageParam.storeImageId).then((storePointsData) => {
             console.log('STORE_POINT_DATA', storePointsData);
             this.storeTypesArr = JSON.parse(storeTypes);
             this.displayTypesArr = JSON.parse(displayTypes);
             for (let i = 0; i < this.displayTypesArr.length; i ++){
               this.displayTypesArr[i]['storeDisplays'] = [];
               for (let j = 0; j < storePointsData.length; j ++){
                 if (storePointsData[j]['displayTypeId']==this.displayTypesArr[i].id){
                   this.displayTypesArr[i]['storeDisplays'].push(storePointsData[j]);
                   console.log('storeDisplays ===> ', this.displayTypesArr[i]['storeDisplays'][j]);
                 }
               }
             }
           });
           this.displaysArr = displays;
         });
       });
     });
   }

   remove(dt, d){
     const storeDisplaysIndex = dt.storeDisplays.findIndex(sd => sd.uId == d.uId);
     dt.storeDisplays.splice(storeDisplaysIndex, 1);
   }

   showActionSheet(dt){
     let buttonOptions = [];
     this.selectedDisplayType = dt;
     for (let d of dt.DISPLAYs){
       buttonOptions.push({
         text: d.name,
         handler: () => {
           this.showDisplayModal(d, dt);
         }
       });
     }

     buttonOptions.push({
       text: 'បិទផ្ទាំង',
       role: 'cancel'
     });

     let actionSheet = this.actionSheetCtrl.create({
       title: 'ជ្រើសរើសឈុត',
       buttons: buttonOptions
     });

     actionSheet.present();
   }

   showDisplayModal(display, dt){
     this.selectedDisplay = display;
     this.selectedDisplayType = dt;

     this.isNew = false;

     console.log('FIND CONDITION TO CHECK IF IT"S NEW ==> ', display);

     if (!display.conditionId){
       this.isNew = true;
     }

     let modal = this.modalCtrl.create(StoreModalComponent, {display: display, isNew: this.isNew});
     modal.onDidDismiss((data) => {
       if (data){
         if (this.isNew == true){
           console.log('MODAL DISMISS ', data);
           const displayData = {
             id: this.uuid.get(),
             display: this.selectedDisplay,
             name: this.selectedDisplay.name,
             sku: this.selectedDisplay.sku,
             imageUrl: data.imageUrl,
             points: data.points,
             conditionName: data.condition.name,
             conditionId: data.condition.id,
             condition: {id: data.condition.name, name: data.condition.name},
             capturedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
             displayIdStorePoints: this.selectedDisplay.id
           };
           this.selectedDisplayType.storeDisplays.push(displayData);
         }
         else{
           const storeDisplaysIndex =  this.selectedDisplayType.storeDisplays.findIndex(sd => sd.id == data.id);
           this.selectedDisplayType.storeDisplays[storeDisplaysIndex] = data;
         }
       }
     });
     modal.present();

   }


   save(){

     let storeImageId = this.storeImageParam.storeImageId;

     let targetPaths = [];
     let storeDisplaysList = [];
     let optionLists = [];
     this.displayTypesArr.map((dt) => {
       dt.storeDisplays.map((d) => {
         targetPaths.push(d.imageUrl);
         storeDisplaysList.push(d);
       })
     });

     var sImgTargetPath = this.imageUrl;

     let imageUrl = sImgTargetPath;

     let capturedAt = moment().format('YYYY-MM-DD hh:mm:ss');

     let lat = this.lat;
     let lng = this.lng;
     let uploaded = false;
     let storeIdStoreImages = this.storeImageParam.storeId;

     this.databaseprovider.addStoreImage(storeImageId, imageUrl, capturedAt, lat, lng, uploaded, storeIdStoreImages)
     .then(data => {

       for (let i = 0; i < storeDisplaysList.length; i ++){
         let id = storeDisplaysList[i].id;
         let points = storeDisplaysList[i].points;
         let imageUrl = storeDisplaysList[i].imageUrl;
         let uploaded = false;
         let storeIdStorePoints = this.storeImageParam.storeId;
         let userIdStorePoints = this.user.id;
         let displayIdStorePoints = storeDisplaysList[i].display.id;
         let storeImageIdStorePoints = storeImageId;
         let conditionIdStorePoints = storeDisplaysList[i].conditionId;

         this.databaseprovider.addStorePoint(
           id,
           points,
           imageUrl,
           uploaded,
           storeIdStorePoints,
           userIdStorePoints,
           displayIdStorePoints,
           storeImageIdStorePoints,
           conditionIdStorePoints
           ).then(() => {
             console.log('i ===> ', i);
             console.log('storeDisplayList ===> ', storeDisplaysList.length);
             if (i == storeDisplaysList.length - 1){
               this.navCtrl.pop();
             }
           });
         }
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
     // Create options for the Camera Dialog
     var options = {
       quality: 50,
       sourceType: sourceType,
       saveToPhotoAlbum: true,
       correctOrientation: true,
       destinationType: this.camera.DestinationType.FILE_URI
     };

     this.camera.getPicture(options).then((imagePath) => {
       // this.imgSrc = 'data:image/jpg;base64,' + imageData;
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
       this.presentToast('Error while selecting image.');
     });
   }


   // Create a new name for the image
   private createFileName() {
     var d = new Date(),
     n = d.getTime(),
     newFileName =  n + ".jpg";
     return newFileName;
   }

   // Copy the image to a local folder
   private copyFileToLocalDir(namePath, currentName, newFileName) {
     this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
       this.imageUrl = newFileName;
     }, error => {
       this.presentToast('Error while storing file.');
     });
   }

   // Always get the accurate path to your apps folder
   public pathForImage(img) {
     if (img === null) {
       return '';
     } else {
       return cordova.file.dataDirectory + img;
     }
   }

   public byPass(img){
     return this._sanitizer.bypassSecurityTrustResourceUrl(img);
   }

   private presentToast(text) {
     let toast = this.toastCtrl.create({
       message: text,
       duration: 3000,
       position: 'top'
     });
     toast.present();
   }


 }

