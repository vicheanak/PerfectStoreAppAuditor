import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';



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
  @ViewChild('imageFile1') imageFile1;
  @ViewChild('imageFile2') imageFile2;

  constructor(public navCtrl: NavController,  public alertCtrl: AlertController, public navParams: NavParams, public camera: Camera, public storePointsServices: StorePointServicesProvider) {
    this.imgSrc1 = '../../assets/img/take-photo.png';
    this.imgSrc2 = '../../assets/img/take-photo.png';
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPointPage');
    this.storePointsServices.getStorePoints().subscribe((data)=> {
      console.log('Store Points', data);
    });
  }

  processWebImage1(event) {
    console.log('img1');
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.imgSrc1 = imageData;

    };

    reader.readAsDataURL(event.target.files[0]);
  }

  processWebImage2(event) {
    console.log('img2');
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.imgSrc2 = imageData;

    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getPicture1() {
    //const options: CameraOptions = {
      //quality: 100,
      //destinationType: this.camera.DestinationType.DATA_URL,
      //encodingType: this.camera.EncodingType.JPEG,
      //mediaType: this.camera.MediaType.PICTURE
    //}
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 50
      }).then((data) => {
        this.imgSrc1 = 'data:image/jpg;base64,' + data;
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.imageFile1.nativeElement.click();
    }
  }

  getPicture2() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 50
      }).then((data) => {
        this.imgSrc2 = 'data:image/jpg;base64,' + data;
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.imageFile2.nativeElement.click();
    }
  }


  save(){
    this.imgData1 = this.imgSrc1.substr(this.imgSrc1.indexOf('base64,') + 'base64,'.length);
    this.imgData2 = this.imgSrc2.substr(this.imgSrc2.indexOf('base64,') + 'base64,'.length);

    let data = {
      points: 2000,
      imageUrl: this.imgData1,
      storeIdStorePoints: 1,
      userIdStorePoints: 1,
      displayIdStorePoints: 1
    };

    this.storePointsServices.createStorePoints(data).subscribe((data)=> {
      console.log('Store Points', data);
    });
    //this.navCtrl.setPages([
    //{ page: HomePage }
    //]);
  }

}
