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
  imageUrl: any;

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

  ionViewDidEnter() {

    this.databaseprovider.getAllDisplays().then((allDisplays) => {
      this.allDisplays = allDisplays;
    });

    this.isNew = this.navParams.data.isNew;
    this.display = this.navParams.data.display;
    let displayId = this.display.id;
    if (!this.isNew){
      displayId = this.display.display.id;
    }

    console.log('DISPLAY_ID', this.display);

    this.databaseprovider.getDisplay(displayId).then((sDisplay) => {

      this.sDisplay = sDisplay[0];
      this.maxPoint = this.sDisplay.points;
      if (this.isNew){
        this.display.points = this.sDisplay.points;
        this.display.sku = this.sDisplay.sku;
        this.display.imageUrl = '';
      }
    });

    this.databaseprovider.getConditionByDisplayId(displayId).then((conditions) => {
      console.log('CONDITION MODAL', conditions);
      this.conditionList = conditions;
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
    } else {
      this.imgFile.nativeElement.click();
    }
  }

  save(){
    console.log('SAVE ==> ',this.display);
    this.viewCtrl.dismiss(this.display);
  }

  dismiss(){
    this.viewCtrl.dismiss();
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

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.display.imageUrl = newFileName;
      this.imageUrl = newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

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

