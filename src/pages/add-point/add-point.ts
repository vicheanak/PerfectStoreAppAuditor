import { Compiler, ViewContainerRef, NgModule, Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {StoreImagesProvider} from '../../providers/store-images/store-images';
import {AddPointPageModule} from '../../pages/add-point/add-point.module';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AddPointPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()

 @Pipe({
   name: 'sanitizeHtml'
 })
 export class SanitizeHtmlPipe implements PipeTransform{
   constructor(private _sanitizer: DomSanitizer){

   }

   transform(v:string):SafeHtml{
     return this._sanitizer.bypassSecurityTrustHtml(v);
   }
 }

 @Component({
   selector: 'alert-success',
   template: `
   <button color="primary" ion-button round  full>
   Success
   </button>
   `,
 })
 export class AlertSuccessComponent {

 }

 @Component({
   selector: 'alert-danger',
   template: `
   <button color="danger" ion-button round full>
   Danger
   </button>
   `,
 })
 export class AlertDangerComponent {

 }

 @Component({
   selector: 'card-display-component',
   template: `
   <input type="file" #imageFile style="visibility: hidden; height: 0px" name="files[]" (change)="processWebImage($event)" />
   <ion-card>
   <ion-item>
   ឈុតចាំបាច់សំរាប់តាំង
   <button item-end ion-button small round icon-only color="danger" (click)="removeDisplayComponent(0)">
   <ion-icon name="md-close"></ion-icon>
   </button>
   </ion-item>
   <img src="{{imgSrc}}" id="{{comId}}" (click)="getPicture($event)">
   <div padding class="flex-container">
   <h1 class="points" color="flex-center">{{points}}</h1>
   </div>
   <ion-item>
   <ion-range min="0" step="10" snaps="true" [(ngModel)]="points">
   <ion-label range-left class="small-text">0</ion-label>
   <ion-label range-right>1800</ion-label>
   </ion-range>
   </ion-item>
   </ion-card>
   `,
 })
 export class CardDisplayComponent {


   @ViewChild('imageFile') imageFile;

   imgSrc: string = '../../assets/img/take-photo.png';
   points: any = 0;
   comId: any = Math.random().toString(36).substr(2, 5);
   constructor(public navCtrl: NavController,
     public alertCtrl: AlertController,
     public navParams: NavParams,
     public camera: Camera,
     public storePointsServices: StorePointServicesProvider,
     public storeImage: StoreImagesProvider,
     private compiler: Compiler,
     private storage: Storage
     ) {
   }

   removeDisplayComponent(addPointPage: AddPointPage){
     console.log(addPointPage);
   }

   processWebImage(event) {
     let reader = new FileReader();
     reader.onload = (readerEvent) => {
       let imageData = (readerEvent.target as any).result;
       this.imgSrc = imageData;
       this.storage.set('storageImage', JSON.stringify({id: this.comId, image: imageData}));
     };
     setTimeout(()=>{
       reader.readAsDataURL(event.target.files[0]);
     }, 3000);

   };

   getPicture(event){

       var target = event.target || event.srcElement || event.currentTarget;
       var idAttr = target.attributes.id;
       var value = idAttr.nodeValue;
       console.log(idAttr);
       console.log(value);

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
       this.imageFile.nativeElement.click();
     }
   }
 }

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
   @ViewChild('imageFile1') imageFile1;
   @ViewChild('imageFile2') imageFile2;
   @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

   alert = AlertSuccessComponent;

   alerts = [];

   cardDisplay: string = `
   <ion-card>
   <ion-item>
   ឈុតចាំបាច់សំរាប់តាំង
   <button item-end ion-button small round icon-only color="danger" (click)="removeCard(0)">
   <ion-icon name="md-close"></ion-icon>
   </button>
   </ion-item>
   <img src="../../assets/img/take-photo.png">
   <div padding class="flex-container">
   <h1 class="points" color="flex-center">{{points}}</h1>
   </div>
   <ion-item>
   <ion-range min="0" step="10" snaps="true" [(ngModel)]="points">
   <ion-label range-left class="small-text">0</ion-label>
   <ion-label range-right>1800</ion-label>
   </ion-range>
   </ion-item>
   </ion-card>
   `
   // cardDisplay: string = `
   // <ion-item>
   // </ion-item>
   // `
   cardDisplays: any;
   cardIndex: number;

   constructor(public navCtrl: NavController,
     public alertCtrl: AlertController,
     public navParams: NavParams,
     public camera: Camera,
     public storePointsServices: StorePointServicesProvider,
     public storeImage: StoreImagesProvider,
     private compiler: Compiler
     ) {
     this.imgSrc1 = '../../assets/img/take-photo.png';
     this.imgSrc2 = '../../assets/img/take-photo.png';
     this.cardDisplays = [];
     this.cardIndex = 0;
   }


   changeComponent() {
     this.alerts.push({
       id: Math.random().toString(36).substr(2, 5),
       component: CardDisplayComponent
     });
   }

   ionViewDidLoad() {

     this.storePointsServices.getStorePoints().subscribe((data)=> {
       console.log('Store Points', data);
     });
     // this.storeId = this.navParams.data.item.STORE.id;
     this.storeId = 1;
     this.storeImage.getStoreImage(this.storeId).subscribe((store)=>{
       this.storeImageUrl = 'http://' + store.imageUrl;
       this.store = store;
       console.log('store', this.store);
     });
   }

   private addComponent(template: string, properties: any = {}) {
     @Component({template})
     class TemplateComponent {}

     @NgModule({
       declarations: [TemplateComponent],
       imports: [
       AddPointPageModule,
       IonicModule.forRoot(TemplateComponent)
       ],
       bootstrap: [IonicApp]
     })

     class TemplateModule {}

     const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
     const factory = mod.componentFactories.find((comp) =>
       comp.componentType === TemplateComponent
       );

     this.cardDisplays.push({
       id: this.randomString,
       component:  this.container.createComponent(factory)
     });

     let index = this.cardDisplays.findIndex(p => p.id == this.randomString);
     console.log(index);

     // this.cardDisplays[this.cardIndex] =
     Object.assign(this.cardDisplays[index].component.instance, properties);

   }

   addNewDisplay(){
     this.cardIndex = this.cardIndex + 1;
     this.randomString = Math.random().toString(36).substr(2, 5);

     this.cardDisplay = `
     <input type="file" #imageFile1 style="visibility: hidden; height: 0px" name="files[]" (change)="processWebImage1($event)" />
     <ion-card id="` + this.randomString + `">
     <ion-item>
     ឈុតចាំបាច់សំរាប់តាំង
     <button item-end ion-button small round icon-only color="danger" (click)="removeCard(0)">
     <ion-icon name="md-close"></ion-icon>
     </button>
     </ion-item>
     <img (click)="getPicture1()" src="{{imgSrc1}}">
     <div padding class="flex-container">
     <h1 class="points" color="flex-center">{{points}}</h1>
     </div>
     <ion-item>
     <ion-range min="0" step="10" snaps="true" [(ngModel)]="points">
     <ion-label range-left class="small-text">0</ion-label>
     <ion-label range-right>1800</ion-label>
     </ion-range>
     </ion-item>
     </ion-card>
     `


     this.cardDisplay = this.cardDisplay.replace("removeCard("+(this.cardIndex - 1 )+")","removeCard("+this.cardIndex+")");
     this.addComponent(this.cardDisplay,
     {
       points: 0,
       removeCard: (id) => {
         let index = this.cardDisplays.findIndex(p => p.id == this.randomString);
         this.cardDisplays[index].component.destroy();
       },
       imgSrc1: '../../assets/img/take-photo.png',
       // processWebImage1: (event) => {
         //   let reader = new FileReader();
         //   reader.onload = (readerEvent) => {
           //     let imageData = (readerEvent.target as any).result;
           //     console.log('base64', imageData);
           //     this.imgSrc1 = imageData;
           //   };
           //   reader.readAsDataURL(event.target.files[0]);
           // },
           getPicture1: () => {
             if (Camera['installed']()) {
               this.camera.getPicture({
                 destinationType: this.camera.DestinationType.DATA_URL,
                 quality: 50
               }).then((data) => {
                 console.log('imgsrc1',this.imgSrc1);
                 this.imgSrc1 = 'data:image/jpg;base64,' + data;
               }, (err) => {
                 alert('Unable to take photo');
               })
             } else {
               this.imageFile1.nativeElement.click();
             }
           }
         }
         );
   }

   removeCard(id){
     console.log('remove card');
   }

   processWebImage1(event) {

     let reader = new FileReader();
     reader.onload = (readerEvent) => {

       let imageData = (readerEvent.target as any).result;

       this.imgSrc1 = imageData;
       // component.changeDetectorRef.detectChanges();


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
