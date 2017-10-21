import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

/**
 * Generated class for the StoreModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
 @Component({
   selector: 'store-modal',
   templateUrl: 'store-modal.html'
 })
 export class StoreModalComponent {

   text: string;
   imgSrc: string;

   constructor(
     public camera: Camera,
     public viewCtrl: ViewController
     ) {
     console.log('Hello StoreModalComponent Component');
     this.text = 'Hello World';
   }

   processWebImage(event) {
     let reader = new FileReader();
     reader.onload = (readerEvent) => {

       let imageData = (readerEvent.target as any).result;
       this.imgSrc = imageData;

     };

     reader.readAsDataURL(event.target.files[0]);
   }

   getPicture() {
     if (Camera['installed']()) {
       this.camera.getPicture({
         destinationType: this.camera.DestinationType.DATA_URL,
         quality: 50
       }).then((data) => {
         this.imgSrc = 'data:image/jpg;base64,' + data;
       }, (err) => {
         alert('Unable to take photo');
       })
     } else {
       // this.imageFile1.nativeElement.click();
     }
   }

 }
