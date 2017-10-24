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
   @ViewChild('imgFile') imgFile;

   tp: any;
   url:any;
   op: any;
   storePointsList: any;


   storeDisplays: any[];

   alerts = [];
   storePoint: any;

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
     private _sanitizer: DomSanitizer
     ) {
     // this.storage.clear();
     this.storeDisplays = [];
   }


   ionViewDidLoad() {
     this.storeData();
     // this.storePointsServices.getStorePoints().subscribe((data)=> {

       //   console.log('Store Points', data);
       // });
       // this.storeId = this.navParams.data.item.STORE.id;
       this.storage.get('userdata').then((userdata) => {
         if (userdata){
           this.user = JSON.parse(userdata);
         }
       });
       // console.log(this.navParams.data);
       this.storePoint = this.navParams.data.sp;

       // console.log(this.storePoint.STORE_IMAGE.imageUrl);
       this.imageUrl = this.storePoint.STORE_IMAGE.imageUrl;
       this.storeId = 1;
       // console.log(this.storeId);
       this.stores.getStore(this.storeId).subscribe((store) => {
         this.store = store;
         console.log(this.store);
       });
     }

     storeData(){
       this.storeTypes.allStoreTypes().subscribe((storeTypes) => {
         this.displayTypes.allDisplayTypes().subscribe((displayTypes)=>{
           this.displays.allDisplays().subscribe((displays) => {
             this.storePointsServices.getStorePointsByStore(this.storePoint.storeIdStorePoints).subscribe((storePointsData) =>
             {
               // this.storePointsList = storePointsData;
               this.storeTypesArr = storeTypes;
               this.displayTypesArr = displayTypes;
               for (let i = 0; i < displayTypes.length; i ++){
                 this.displayTypesArr[i]['storeDisplays'] = [];
                  for (let j = 0; j < storePointsData.length; j ++){
                    console.log('display type id', storePointsData[j]['DISPLAY']['displayTypeIdDisplays']);
                    console.log('this dis type', this.displayTypesArr[i].id);
                    if (storePointsData[j]['DISPLAY']['displayTypeIdDisplays']==this.displayTypesArr[i].id){
                      console.log(storePointsData[j]);
                      this.displayTypesArr[i]['storeDisplays'].push(storePointsData[j]);
                      // console.log(this.storePointsList[j]);
                    }
                  }
               }
               this.displaysArr = displays;
             });

           });
         });
       });
     }

     ionViewDidEnter(){

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

       if (!display.uId){
         this.isNew = true;
       }

       let modal = this.modalCtrl.create(StoreModalComponent, {display: display, isNew: this.isNew});
       modal.onDidDismiss((data) => {
         console.log('Data Returned', data);
         if (data){
           if (this.isNew == true){
             const random =  Math.random().toString(36).substr(2, 5)
             const displayData = {
               id: data.id,
               uId: random,
               displayName: this.selectedDisplay.name,
               imageUrl: data.imageUrl,
               points: data.points,
               capturedAt: new Date()
             };
             this.selectedDisplayType.storeDisplays.push(displayData);
           }
           else{
             const storeDisplaysIndex =  this.selectedDisplayType.storeDisplays.findIndex(sd => sd.uId == data.uId);
             this.selectedDisplayType.storeDisplays[storeDisplaysIndex] = data;
           }
         }
       });
       modal.present();
     }

     save(){
       this.loading = this.loadingCtrl.create({
         content: 'បញ្ជូនទិន្ន័យ',
       });

       // Destination URL
       var url = "http://192.168.8.103:3000/store_points_upload";
       // var url = "https://api.unilever.store/store_points_upload/";

       let targetPaths = [];
       let storeDisplaysList = [];
       let optionLists = [];
       this.displayTypesArr.map((dt) => {
         dt.storeDisplays.map((st) => {
           targetPaths.push(this.pathForImage(st.imageUrl));
           storeDisplaysList.push(st);
           optionLists.push({
             fileKey: 'file',
             fileName: st.imageUrl,
             chunkedMode: false,
             mimeType: "multipart/form-data",
             params : {'fileName': st.imageUrl}
           })
         })
       })

       const fileTransfer: TransferObject = this.transfer.create();

       let uploadArr = [];
       for (let i = 0; i < targetPaths.length; i ++){
         uploadArr.push({
           targetPath: targetPaths[i],
           url: url,
           option: optionLists[i],
           displays: storeDisplaysList[i]
         });
       }



       var sImgTargetPath = this.pathForImage(this.imageUrl);

       // File name only
       var sImgFilename = this.imageUrl;

       var sImgOptions = {
         fileKey: "file",
         fileName: sImgFilename,
         chunkedMode: false,
         mimeType: "multipart/form-data",
         params : {'fileName': sImgFilename}
       };

       fileTransfer.upload(sImgTargetPath, url, sImgOptions).then(success => {
         this.tp = 'upload success';
         this.op = this.user.id;
         let simgData = {
           fileName: sImgFilename,
           storeIdStoreImages: this.storeId
         };
         this.storeImage.createStoreImage(simgData).subscribe((simgRes) => {
           console.log('Store Image ID ==> ', );
           this.url = simgRes.id;


           Observable.forkJoin(
             uploadArr.map(i => fileTransfer.upload(i.targetPath, url, i.option).then(data => {
               let sdata = {
                 points:  i.displays.points,
                 uId: i.displays.uId,
                 fileName: i.option.fileName,
                 storeIdStorePoints: this.storeId,
                 userIdStorePoints: this.user.id,
                 displayIdStorePoints: i.displays.id,
                 storeImageIdStorePoints: simgRes.id
               };
               this.storePointsServices.createStorePoints(sdata).subscribe((sdata)=> {

               });
             }))
             ).subscribe((res) => {
               this.loading.dismissAll();
               this.presentToast('Image succesful uploaded.');
             });

           });
       }, err => {

       });

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
       } else {
         this.imgFile.nativeElement.click();
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
       img = 'http://' + img;
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



     public uploadImage() {
       // Destination URL
       var url = "http://192.168.8.101:3000/store_points_upload";

       // File for Upload
       var targetPath = this.pathForImage(this.imageUrl);

       // File name only
       var filename = this.imageUrl;

       var options = {
         fileKey: "file",
         fileName: filename,
         chunkedMode: false,
         mimeType: "multipart/form-data",
         params : {'fileName': filename}
       };

       const fileTransfer: TransferObject = this.transfer.create();

       this.loading = this.loadingCtrl.create({
         content: 'Uploading...',
       });

       this.loading.present();


       // Use the FileTransfer to upload the image
       fileTransfer.upload(targetPath, url, options).then(data => {
         this.loading.dismissAll();


         this.presentToast('Image succesful uploaded.');
       }, err => {
         this.loading.dismissAll();
         this.presentToast('Error while uploading file.');
       });
     }

   }

