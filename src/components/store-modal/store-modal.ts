import { Component, ViewChild } from '@angular/core';
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
   imgSrc: string = '../../assets/img/take-photo.png';
   points: number = 0;
   @ViewChild('imgFile') imgFile;

   constructor(
     public camera: Camera,
     public viewCtrl: ViewController
     ) {
     console.log('Hello StoreModalComponent Component');
     this.points = 0;
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
       this.imgFile.nativeElement.click();
     }
   }

   save(){
     // this.imgData1 = this.imgSrc1.substr(this.imgSrc1.indexOf('base64,') + 'base64,'.length);
     // this.imgData2 = this.imgSrc2.substr(this.imgSrc2.indexOf('base64,') + 'base64,'.length);

     // let data = {
     //   points: 2000,
     //   imageUrl: this.imgData1,
     //   storeIdStorePoints: 1,
     //   userIdStorePoints: 1,
     //   displayIdStorePoints: 1
     // };

     // this.storePointsServices.createStorePoints(data).subscribe((data)=> {
     //   console.log('Store Points', data);
     // });
     //this.navCtrl.setPages([
     //{ page: HomePage }
     //]);

      this.viewCtrl.dismiss({
       imageUrl: this.imgSrc,
       points: this.points
     });
   }

   dismiss(){
     this.viewCtrl.dismiss();
   }

 }
