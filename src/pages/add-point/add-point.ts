import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
   @ViewChild('imgSrc11') imgSrc11;
   @ViewChild('imgSrc22') imgSrc22;
   @ViewChild('fileInput') fileInput;

   constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera) {
     this.imgSrc1 = '../../assets/img/take-photo.png';
     this.imgSrc2 = '../../assets/img/take-photo.png';
   }


   processWebImage(event) {
     let reader = new FileReader();
     reader.onload = (readerEvent) => {

       let imageData = (readerEvent.target as any).result;
       this.imgSrc1 = imageData;

     };

     reader.readAsDataURL(event.target.files[0]);
   }


   getPicture1() {
     if (Camera['installed']()) {
       this.camera.getPicture({
         destinationType: this.camera.DestinationType.DATA_URL,
         targetWidth: 96,
         targetHeight: 96
       }).then((data) => {
         this.imgSrc1 = 'data:image/jpg;base64,' + data;
       }, (err) => {
         alert('Unable to take photo');
       })
     } else {
       this.fileInput.nativeElement.click();
     }
   }

   getPicture2() {
     if (Camera['installed']()) {
       this.camera.getPicture({
         destinationType: this.camera.DestinationType.DATA_URL,
         targetWidth: 96,
         targetHeight: 96
       }).then((data) => {
         this.imgSrc2 = 'data:image/jpg;base64,' + data;
       }, (err) => {
         alert('Unable to take photo');
       })
     } else {
       this.fileInput.nativeElement.click();
     }
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad AddPointPage');
   }

   toStoreDetail(){
     this.navCtrl.setPages([
       { page: HomePage }
       ]);
   }

 }
