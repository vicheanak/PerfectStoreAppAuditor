import { Component, ViewChild } from '@angular/core';
import { ViewController,NavParams, ToastController, LoadingController, ActionSheetController,Platform, Loading } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {DisplaysProvider} from '../../providers/displays/displays';

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
  display: any;
  maxPoint: any;
  isNew: boolean;
  @ViewChild('imgFile') imgFile;

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
    ) {
    // console.log('Hello StoreModalComponent Component');
    // this.points = 0;

    this.isNew = this.navParams.get("isNew");
    this.display = this.navParams.get("display");


    // console.log('Display 1st NavParams', this.display);
  }

  ionViewDidLoad() {
    // console.log('this.display.id', this.display.id);
    this.displays.getDisplay(this.display.id).subscribe((sDisplay) => {
      // console.log('Displays From Local ===> ', sDisplay);
      this.maxPoint = sDisplay.points;
      if (this.isNew){
        this.display.points = sDisplay.points;
        this.display.imageUrl = '';
      }
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

    public uploadImage() {
      // Destination URL
      var url = "http://192.168.8.101:3000/store_points_upload";

      // File for Upload
      var targetPath = this.pathForImage(this.display.imageUrl);

      // File name only
      var filename = this.display.imageUrl;

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
        let sdata = {
          points: 2000,
          fileName: filename,
          storeIdStorePoints: 1,
          userIdStorePoints: 1,
          displayIdStorePoints: 1
        };
        this.storePointsServices.createStorePoints(sdata).subscribe((sdata)=> {

        });

        this.presentToast('Image succesful uploaded.');
      }, err => {
        this.loading.dismissAll();
        this.presentToast('Error while uploading file.');
      });
    }

  }

