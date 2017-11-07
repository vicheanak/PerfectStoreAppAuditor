import { Component, ViewChild } from '@angular/core';
import { ViewController,NavParams, ToastController, LoadingController, ActionSheetController,Platform, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {DisplaysProvider} from '../../providers/displays/displays';
import {ConditionsProvider} from '../../providers/conditions/conditions';
import { DatabaseProvider } from './../../providers/database/database';

declare var cordova: any;

@Component({
  selector: 'store-modal',
  templateUrl: 'store-modal.html'
})
export class StoreModalComponent {

  text: string;
  imgSrc: string = '../../assets/img/take-photo.png';
  points: number = 0;
  loading: Loading;
  readPlatform;
  display: any = {};
  maxPoint: any;
  isNew: boolean;
  @ViewChild('imgFile') imgFile;
  conditionList: any;
  sDisplay: any;
  allDisplays: any;

  constructor(
    public camera: Camera,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public storePointsServices: StorePointServicesProvider,
    public platform: Platform,
    private file: File,
    private filePath: FilePath,
    private transfer: Transfer,
    private navParams: NavParams,
    public displays: DisplaysProvider,
    public conditions: ConditionsProvider,
    public databaseprovider: DatabaseProvider
    ) {
    // console.log('Hello StoreModalComponent Component');
    // this.points = 0;


    this.display.points = 0;

    // console.log('Display 1st NavParams', this.display);
  }

  ionViewDidLoad() {
    this.databaseprovider.getAllDisplays().then((allDisplays) => {
      console.log('ALL DISPLAYS ====> ', allDisplays);
      this.allDisplays = allDisplays;
    });
    this.isNew = this.navParams.data.isNew;
    this.display = this.navParams.data.display;
    console.log('DISPLAY  MODAL =====> ', this.display);
    console.log('LOOKING FOR CONDITION add to display.condition =====> ', this.display);
    let getId = this.display.id;
    this.databaseprovider.getDisplay(getId).then((sDisplay) => {
      console.log('ssssssssDISPLAY ===> ', sDisplay[0]);
      this.sDisplay = sDisplay[0];
      this.maxPoint = this.sDisplay.points;
      if (this.isNew){
        this.display.points = this.sDisplay.points;
        this.display.sku = this.sDisplay.sku;
        this.display.imageUrl = '';
      }
    });

    this.databaseprovider.getConditionByDisplayId(getId).then((conditions) => {
      this.conditionList = conditions;
    });

  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.display.imageUrl = imageData;
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

  save(){
    console.log('Display from Add Point Param ==> ',this.display);
    this.viewCtrl.dismiss(this.display);
  }


  dismiss(){
    this.viewCtrl.dismiss();
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
        this.display.imageUrl = newFileName;
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

