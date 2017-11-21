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
  import { Geolocation } from '@ionic-native/geolocation';

  import { HomePage } from '../home/home';
  import { StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
  import { StoreImagesProvider } from '../../providers/store-images/store-images';
  import { StoreModalComponent } from '../../components/store-modal/store-modal';
  import { StoreTypesProvider } from '../../providers/store-types/store-types';
  import { DisplayTypesProvider } from '../../providers/display-types/display-types';
  import { DisplaysProvider } from '../../providers/displays/displays';
  import { StoresProvider } from '../../providers/stores/stores';
  import {HostNameProvider} from '../../providers/host-name/host-name';
  import {UuidProvider} from '../../providers/uuid/uuid';
  import { Storage } from '@ionic/storage';
  declare var cordova: any;
  import {Observable} from 'rxjs/Rx';
  import {Http, Response} from '@angular/http';
  import { DatabaseProvider } from './../../providers/database/database';
  import moment from 'moment';

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
   @ViewChild('imgFile') imgFile;

   tp: any;
   url:any;
   op: any;
   lat: any;
   lng: any;

   printUuids: any;
   printStoreImageUuid: any;
   successMsg1: any;
   successMsg2: any;
   successMsg3: any;

   storeImages: any = [];
   storePoints: any = [];

   storeDisplays: any[];

   alerts = [];

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
   isValid: any;

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
     public hostname: HostNameProvider,
     private geolocation: Geolocation,
     public uuid: UuidProvider,
     private databaseprovider: DatabaseProvider,
     ) {
     // this.storage.clear();
     this.storeDisplays = [];
   }

   ionViewDidEnter() {
     this.storeData();

     this.storage.get('userdata').then((userdata) => {
       if (userdata){
         this.user = JSON.parse(userdata);
       }
     });

     this.storeId =  this.navParams.data.id;
     this.databaseprovider.getStore(this.storeId).then((data) => {
       this.store = data[0];
     });

     this.geolocation.getCurrentPosition().then((resp) => {
       this.lat = resp.coords.latitude;
       this.lng = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     this.databaseprovider.getDatabaseState().subscribe(rdy => {
       if (rdy) {
         this.loadStoreImages();
         this.loadStorePoints();
       }
     });
   }

   storeData(){
     this.storage.get('storeTypes').then((storeTypes) => {
       this.storage.get('displayTypes').then((displayTypes)=>{
         this.storage.get('displays').then((displays) => {
           this.storeTypesArr = JSON.parse(storeTypes);
           this.displayTypesArr = JSON.parse(displayTypes);
           for (let i = 0; i < this.displayTypesArr.length; i ++){
             this.displayTypesArr[i]['storeDisplays'] = [];
           }
           this.displaysArr = displays;
         });
       });
     });
   }


   remove(dt, d){
     const storeDisplaysIndex = dt.storeDisplays.findIndex(sd => sd.id == d.id);
     dt.storeDisplays.splice(storeDisplaysIndex, 1);
   }

   showActionSheet(dt){
     let buttonOptions = [];
     this.selectedDisplayType = dt;
     for (let display of dt.DISPLAYs){
       buttonOptions.push({
         text: display.name + ' - SKU: ' + display.sku,
         handler: () => {
           this.showDisplayModal(display, dt);
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

     let storeImageId = this.uuid.get();

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
     let storeIdStoreImages = this.store.id;

     this.databaseprovider.addStoreImage(storeImageId, imageUrl, capturedAt, lat, lng, uploaded, storeIdStoreImages)
     .then(data => {

       let storePointId = this.uuid.get();

       for (let i = 0; i < storeDisplaysList.length; i ++){

         let id = storeDisplaysList[i].id;
         let points = storeDisplaysList[i].points;
         let imageUrl = storeDisplaysList[i].imageUrl;
         let uploaded = false;
         let storeIdStorePoints = this.store.id;
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
             this.navCtrl.pop();
             // this.databaseprovider.getAllStorePoints().then(data1 => {
             //   this.storePoints = data1;
             // });
             // this.databaseprovider.getAllStoreImages().then(data2 => {
             //   this.storeImages = data2;
             // });
           });
         }
       });
   }

   loadStoreImages() {
     this.databaseprovider.getAllStoreImages().then(data => {
       this.storeImages = data;
     })
   }



   loadStorePoints() {
     this.databaseprovider.getAllStorePoints().then(data => {
       this.storePoints = data;
     })
   }


   processWebImage(event) {
     let reader = new FileReader();
     reader.onload = (readerEvent) => {
       let imageData = (readerEvent.target as any).result;
       this.imageUrl = imageData;
     };
     reader.readAsDataURL(event.target.files[0]);
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

   private presentToast(text) {
     let toast = this.toastCtrl.create({
       message: text,
       duration: 3000,
       position: 'top'
     });
     toast.present();
   }


 }

