import { Compiler, ViewContainerRef, NgModule, Component, ViewChild, Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Camera } from '@ionic-native/camera';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {StoreImagesProvider} from '../../providers/store-images/store-images';
import {AddPointPageModule} from '../../pages/add-point/add-point.module';


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
   @ViewChild('imageFile1') imageFile1;
   @ViewChild('imageFile2') imageFile2;
   @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;


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
   cardDisplays: any = [];
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


   ionViewDidLoad() {
     console.log('ionViewDidLoad AddPointPage');
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

     this.cardDisplays[this.cardIndex] = this.container.createComponent(factory);

     Object.assign(this.cardDisplays[this.cardIndex].instance, properties);
     // setTimeout(()=>{
     //   component.destroy();
     // }, 2000);
     // If properties are changed at a later stage, the change detection
     // may need to be triggered manually:
     // component.changeDetectorRef.detectChanges();
   }

   addNewDisplay(){
     this.cardIndex = this.cardIndex + 1;

     console.log('card index', this.cardIndex);
     this.cardDisplay = this.cardDisplay.replace("removeCard("+(this.cardIndex - 1 )+")","removeCard("+this.cardIndex+")");
     console.log(this.cardDisplay);
     this.addComponent(this.cardDisplay,
     {
       points: 0,
       removeCard: (id) => {
         this.cardDisplays[id].destroy();
       }
     }
     );
     // console.log(this.cardDisplay);
     // this.cardDisplays.push(this.cardDisplay);
   }

   removeCard(id){
     console.log('remove card');
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
