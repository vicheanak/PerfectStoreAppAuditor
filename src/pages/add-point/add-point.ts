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
  import { Storage } from '@ionic/storage';
  declare var cordova: any;
  import {Observable} from 'rxjs/Rx';
  import {Http, Response} from '@angular/http';
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


   storeDisplays: any[];

   alerts = [];

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
     private geolocation: Geolocation
     ) {
     // this.storage.clear();
     this.storeDisplays = [];
   }

   ionViewDidLoad() {
     this.storeData();

       this.storage.get('userdata').then((userdata) => {
         if (userdata){
           this.user = JSON.parse(userdata);
         }
       });
       this.storeId = 1;
       this.storeId =  this.navParams.data.id;
       this.storage.get('store-'+this.storeId).then((store) => {
         this.store = JSON.parse(store);
       });
       // this.stores.getStore(this.storeId).subscribe((store) => {
       //   this.store = store;
       //   console.log(this.store);
       // });
       this.geolocation.getCurrentPosition().then((resp) => {
         this.lat = resp.coords.latitude;
         this.lng = resp.coords.longitude;
       }).catch((error) => {
         console.log('Error getting location', error);
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
       // this.storeTypes.allStoreTypes().subscribe((storeTypes) => {
       //   this.displayTypes.allDisplayTypes().subscribe((displayTypes)=>{
       //     this.displays.allDisplays().subscribe((displays) => {
       //       this.storeTypesArr = storeTypes;
       //       this.displayTypesArr = displayTypes;
       //       for (let i = 0; i < this.displayTypesArr.length; i ++){
       //         this.displayTypesArr[i]['storeDisplays'] = [];
       //       }
       //       this.displaysArr = displays;
       //     });
       //   });
       // });
     }

     ionViewDidEnter(){

       // this.storage.clear();
       // this.storage.forEach((value, key) => {
         //   const localKey = 'storeId-'+this.storeId+'==';
         //   if (key.indexOf(localKey) > -1){
           //     this.storage.get(key).then(res => {
             //       const resStore = JSON.parse(res);
             //       this.storeDisplays.push(resStore);
             //     });
             //   }
             // });
           }


           remove(dt, d){
             const storeDisplaysIndex = dt.storeDisplays.findIndex(sd => sd.uId == d.uId);
             dt.storeDisplays.splice(storeDisplaysIndex, 1);
           }

           showActionSheet(dt){
             let buttonOptions = [];
             this.selectedDisplayType = dt;
             for (let d of dt.DISPLAYs){
               console.log('sku', d);
               buttonOptions.push({
                 text: d.name + ' - SKU: ' + d.sku,
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
                 // console.log('condition id', data.condition.id);
                 // console.log('condition name', data.condition.name);
                 if (this.isNew == true){
                   const random =  Math.random().toString(36).substr(2, 5)
                   const displayData = {
                     id: data.id,
                     uId: random,
                     displayName: this.selectedDisplay.name,
                     imageUrl: data.imageUrl,
                     points: data.points,
                     conditionName: data.condition.name,
                     conditionId: data.condition.id,
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


             var url = this.hostname.get() + "/store_points_upload/";

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

             // uploadArr.map(i => fileTransfer.upload(i.targetPath, url, i.option));
             this.loading = this.loadingCtrl.create({
               content: 'Uploading...',
             });
             this.loading.present();

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
                 storeIdStoreImages: this.storeId,
                 lat: this.lat,
                 lng: this.lng
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
                       storeImageIdStorePoints: simgRes.id,
                       conditionIdStorePoints: i.displays.conditionId
                     };
                     this.storePointsServices.createStorePoints(sdata).subscribe((sdata)=> {

                     });
                   }))
                   ).subscribe((res) => {
                     this.loading.dismissAll();
                     this.presentToast('បញ្ជូនរូបភាពរួចរាល់');
                     this.navCtrl.pop();
                   });

                 });
             }, err => {

             });


             // Observable.forkJoin(
             //   uploadArr.map(i => fileTransfer.upload(i.targetPath, url, i.option).then(data => {
               //     let sdata = {
                 //       points: 2000,
                 //       fileName: i.option.fileName,
                 //       storeIdStorePoints: 1,
                 //       userIdStorePoints: 1,
                 //       displayIdStorePoints: 1
                 //     };
                 //     this.storePointsServices.createStorePoints(sdata).subscribe((sdata)=> {

                   //     });
                   //   }))
                   //   ).subscribe((res) => {
                     //     this.loading.dismissAll();
                     //     this.presentToast('Image succesful uploaded.');
                     //   });




                     // this.tp = uploadArr[0].targetPath;
                     // this.url = url;
                     // this.op = uploadArr[0].option.fileName;

                     // fileTransfer.upload(uploadArr[0].targetPath, url, uploadArr[0].option).then(data => {
                       //   this.loading.dismissAll();
                       //   let sdata = {
                         //     points: 2000,
                         //     fileName: uploadArr[0].option.fileName,
                         //     storeIdStorePoints: 1,
                         //     userIdStorePoints: 1,
                         //     displayIdStorePoints: 1
                         //   };
                         //   this.storePointsServices.createStorePoints(sdata).subscribe((sdata)=> {

                           //   });
                           //   this.presentToast('Image succesful uploaded.');
                           // }, err => {
                             //   this.loading.dismissAll();
                             //   this.presentToast('Error while uploading file.');
                             // });



                             // let pages = [1,2,3];
                             // Observable.forkJoin(
                             //   pages.map(i =>
                             //     this.http.get('http://localhost:3000/stores/' + i)
                             //     )
                             //   ).subscribe(people => console.log(people));



                             // Observable.forkJoin(
                             //   return this.http.get(this.getApiUrl)
                             //   .map((res : Response ) =>{
                               //     let data = res.json();
                               //     return data.records;
                               //   })
                               //   );

                               // Observable.forkJoin(
                               //   pages.map(
                               //     i => this.http.get('http://swapi.co/api/people/?page=' + i)
                               //     .map(res => res.json())
                               //     )
                               //   ).subscribe(people => this.people = people);

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
                               // this.loading = this.loadingCtrl.create({
                                 //   content: 'Uploading...',
                                 // });
                                 // this.loading.present();
                                 // Get the data of an image
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
                                 // var url = "http://192.168.8.101:3000/store_points_upload";
                                 var url = "https://api.unilever.store/store_points_upload";

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
                                   // let sdata = {
                                     //   points: 2000,
                                     //   fileName: filename,
                                     //   storeIdStorePoints: 1,
                                     //   userIdStorePoints: 1,
                                     //   displayIdStorePoints: 1
                                     // };
                                     // this.storePointsServices.createStorePoints(sdata).subscribe((sdata)=> {

                                       // });

                                       this.presentToast('Image succesful uploaded.');
                                     }, err => {
                                       this.loading.dismissAll();
                                       this.presentToast('Error while uploading file.');
                                     });
                               }

                             }

