import { Component } from '@angular/core';
import { NavController, ToastController, Loading, LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import {ConditionsProvider} from '../../providers/conditions/conditions';
import {StoreTypesProvider} from '../../providers/store-types/store-types';
import {DisplayTypesProvider} from '../../providers/display-types/display-types';
import {DisplaysProvider} from '../../providers/displays/displays';
import {StoresProvider} from '../../providers/stores/stores';
import {UsersStoresProvider} from '../../providers/users-stores/users-stores';
import {RewardServicesProvider} from '../../providers/reward-services/reward-services';
import {Observable} from 'rxjs/Rx';
import { DatabaseProvider } from './../../providers/database/database';
import {RegionProvider} from '../../providers/region/region';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import {UploadProvider} from '../../providers/upload/upload';
import {StoreImagesProvider} from '../../providers/store-images/store-images';
import {StorePointServicesProvider} from '../../providers/store-point-services/store-point-services';
import {StoreRewardsProvider} from '../../providers/store-rewards/store-rewards';
declare var cordova: any;

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  userData: any;
  loading: Loading;
  developer = {};
  developers = [];
  storeImages = [];
  storePoints = [];
  storeImage = {};
  storePoint = {};
  rewards = [];
  msg1 = '';


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public user: UserProvider,
    private storage: Storage,
    public conditionsProvider: ConditionsProvider,
    public storeTypesProvider: StoreTypesProvider,
    public displayTypesProvider: DisplayTypesProvider,
    public displaysProvider: DisplaysProvider,
    public usersStoresProvider: UsersStoresProvider,
    public rewardsProvider: RewardServicesProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public storesProvider: StoresProvider,
    private databaseprovider: DatabaseProvider,
    public regionProvider: RegionProvider,
    private file: File,
    private filePath: FilePath,
    private transfer: Transfer,
    private uploadProvider: UploadProvider,
    private storeImagesProvider: StoreImagesProvider,
    private storePointsProvider: StorePointServicesProvider,
    private storeRewardsProvider: StoreRewardsProvider
    ) {
    this.storage.get('userdata').then((userdata) => {
      if (userdata){
        this.userData = JSON.parse(userdata);
      }
    });

    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {


      }
    })

  }

  changePassword() {
    const alert = this.alertCtrl.create({
      title: 'ប្តូលេខសំងាត់',
      inputs: [
      {
        name: 'oldPassword',
        placeholder: 'លេខសំងាត់ចាស់',
        type: 'password'
      },
      {
        name: 'newPassword',
        placeholder: 'លេខសំងាត់ថ្មី',
      }
      ],
      buttons: [
      {
        text: 'បិទផ្ទាំងនេះ',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'យល់ព្រម',
        handler: data => {
          this.user.changePassword(this.userData.id, data.oldPassword, data.newPassword).subscribe((respond)=>{
            if (respond.id){
              const alert = this.alertCtrl.create({
                title: 'ប្តូរលេខសំងាត់ជោគជ័យ',
                buttons: [{
                  text: 'បិទ',
                  handler: data => {
                    console.log('logout');
                    this.storage.remove('userdata');
                    window.location.reload();
                  }
                }],
                subTitle: 'សូមធ្វើការផ្ទៀងផ្ទាត់ម្តងទៀត',
              });
              alert.present().then(() => {
                console.log('dismiss');
              });
            }
            else{
              const alert = this.alertCtrl.create({
                title: 'ខុសលេងសំងាត់',
                subTitle: 'សូមធ្វើការផ្ទៀងផ្ទាត់ម្តងទៀត',
                buttons: ['បិទ']
              });
              alert.present();
            }

          });
        }
      }
      ]
    });
    alert.present();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  pull(){
    this.loading = this.loadingCtrl.create({
      content: 'ទាញយកទិន្ន័យ',
    });

    this.loading.present();


    let conditionLoad = false;
    let displayLoad = false;
    let displayTypeLoad = false;
    let userStoreLoad = false;
    let rewardLoad = false;
    let storeTypeLoad = false;
    let regionLoad = false;


    this.rewardsProvider.allRewards().subscribe((rewards) => {
      console.log('1. REWARDS SERVER ===> ', rewards);
      let counter = 0;
      rewards.map((i) => {

        let id = i.id;
        let name = i.name;
        let points = i.points;
        let imageUrl = i.imageUrl;
        let filename = imageUrl.split('public/uploads/');

        filename = filename[filename.length - 1];
        var targetPath = cordova.file.dataDirectory + filename;

        const fileTransfer: TransferObject = this.transfer.create();
        fileTransfer.download(imageUrl, targetPath).then((entry) => {

          this.databaseprovider.addReward(id, name, points, entry.toURL()).then((res) => {
            counter ++;
            this.msg1 = res;
            if (counter == rewards.length){
              console.log('1. REWARDS DONE');
              rewardLoad = true;
            }
          });
        }, (error) => {
          console.log('ERROR ==> ', error);
          this.msg1 = error.exception;
        });

      })
    });

    this.regionProvider.allRegions().subscribe((regions) => {
      console.log('2. REGIONS SERVER ===> ', regions);
      let counter = 0;
      regions.map((i) => {
        let id = i.id;
        let name = i.name;
        this.databaseprovider.addRegion(id, name).then(() => {
          counter ++;
          if (counter == regions.length){
            console.log('2. REGIONS DONE');
            regionLoad = true;
          }
        });
      })
    });

    this.displayTypesProvider.allDisplayTypes().subscribe((displayTypes) => {
      console.log('3. DISPLAY_TYPE SERVER ===> ', displayTypes);
      this.storage.set('displayTypes', JSON.stringify(displayTypes));
      let counter = 0;
      displayTypes.map((i) => {
        let id = i.id;
        let name = i.name;
        this.databaseprovider.addDisplayType(id, name).then(() => {
          counter ++;
          if (counter == displayTypes.length){
            console.log('3. DISPLAY TYPE DONE');
            displayTypeLoad = true;
          }
        });
      })
    });

    this.storeTypesProvider.allStoreTypes().subscribe((storeTypes) => {
      console.log('4. STORE TYPE SERVER ===> ', storeTypes);
      this.storage.set('storeTypes', JSON.stringify(storeTypes));
      let counter = 0;
      storeTypes.map((i) => {
        let id = i.id;
        let name = i.name;
        this.databaseprovider.addStoreType(id, name).then(() => {
          this.displayTypesProvider.getDisplayType(id).subscribe((data1) => {
            this.storage.set('DISPLAY_TYPEs_' + id, JSON.stringify(data1)).then(()=>{
              counter ++;
              if (counter == storeTypes.length){
                console.log('4. STORE TYPES DONE');
                storeTypeLoad = true;
              }
            });
          });
        });
      })
    });

    this.displaysProvider.allDisplays().subscribe((displays) => {
      console.log('5. DISPLAYS SERVER ===> ', displays);
      this.storage.set('displays', JSON.stringify(displays));
      let counter = 0;
      displays.map((i) => {

        let id = i.id;
        let name = i.name;
        let points = i.points;
        let imageUrl = i.imageUrl;
        let status = i.status;
        let sku = i.sku;
        let displayTypeIdDisplays = i.displayTypeIdDisplays;
        let storeTypeIdDisplays = i.storeTypeIdDisplays;

        let filename = imageUrl.split('public/uploads/');
        filename = filename[filename.length - 1];

        var targetPath = cordova.file.dataDirectory + filename;

        const fileTransfer: TransferObject = this.transfer.create();
        fileTransfer.download(imageUrl, targetPath).then((entry) => {
          this.databaseprovider.addDisplay(id, name, points, entry.toURL(), status, sku, displayTypeIdDisplays, storeTypeIdDisplays).then(() => {
            counter ++;
            if (counter == displays.length){
              console.log('5. DISPLAY DONE');
              displayLoad = true;
            }
          });
        }, (error) => {
          console.log('ERROR ==> ', error);
          this.msg1 = error.exception;
        });
      })
    });

    this.conditionsProvider.all().subscribe((conditions) => {
      console.log('6. CONDITIONS SERVER ===> ', conditions);
      let counter = 0;
      conditions.map((i) => {
        let id = i.id;
        let name = i.name;
        let displayIdConditions = i.displayIdConditions;
        this.databaseprovider.addCondition(id, name, displayIdConditions).then(() => {
          counter ++;
          if (counter == conditions.length){
            console.log('6. CONDITION DONE');
            conditionLoad = true;
          }
        });
      })
    });

    this.usersStoresProvider.getUsersStores(this.userData.id).subscribe((usersStores) => {
      console.log('7. USER STORE SERVER ===> ', usersStores);
      this.storage.set('usersStores', JSON.stringify(usersStores)).then(()=>{
        let countArr = 0;
        usersStores.map(i => {
          this.storesProvider.getStore(i.storeIdUsersStores).subscribe((store) => {
            let id = store.id;
            let name = store.name;
            let address = store.address;
            let phone = store.phone;
            let lat = store.lat;
            let lng = store.lng;
            let status = store.status;
            let uploaded = store.uploaded;
            let storeTypeIdStores = store.storeTypeIdStores;
            let regionIdStores = store.regionIdStores;
            this.databaseprovider.addStore(id,name,address,phone,lat,lng,status,uploaded,storeTypeIdStores,regionIdStores).then(() => {
              countArr ++;
              if (countArr == usersStores.length){
                console.log('7. USER STORE DONE');
                userStoreLoad = true;
              }
            });
          });
        });
      });
    });

    let checking = setInterval(()=>{
      if (conditionLoad &&
        storeTypeLoad &&
        displayLoad &&
        displayTypeLoad &&
        userStoreLoad &&
        rewardLoad &&
        userStoreLoad &&
        conditionLoad){
        clearInterval(checking);
      this.loading.dismissAll();
      this.presentToast('ទាញយកទិន្ន័យដោយជោគជ័យ');
    }
  }, 500);

  }

  push(){
    this.loading = this.loadingCtrl.create({
      content: 'បញ្ជូនទិន្ន័យ',
    });

    this.loading.present();
    this.databaseprovider.getUploadedStoreImages().then((storeImages) => {
      let imageUrls = [];
      storeImages.map(i => {
        imageUrls.push(i.imageUrl);
      });
      this.uploadProvider.upload(imageUrls).subscribe((data) => {
        this.createSI(storeImages);
      }, (error) => {
        if (error.http_status == 200){
          this.createSI(storeImages);
          console.log('SUCCESS UPLOAD CATCH ==>');
          this.loading.dismissAll();
          this.presentToast('បញ្ជូនទិន្ន័យដោយជោគជ័យ');
        }
      });
    });

  }

  createSI(storeImages){
    let counter = 0;
    storeImages.map(i => {
      this.storeImagesProvider.createStoreImage(i).subscribe((successStoreImages) => {
        counter ++;
        if (counter == storeImages.length){
          this.uploadSP();
        }
      }, (errorStoreImages) => {
        console.log('ERROR STORE IMAGE ', errorStoreImages);
      });
    });
  }

  uploadSP(){
    this.databaseprovider.getUploadedStorePoints().then((storePoints) => {
      let imageUrls = [];
      storePoints.map(j => {
        imageUrls.push(j.imageUrl);
      });
      this.uploadProvider.upload(imageUrls).subscribe((data) => {
        this.createSP(storePoints);
      }, (error) => {
        if (error.http_status == 200){
          this.createSP(storePoints);
          console.log('ERROR SP UPLOAD CATCH ==>');
        }
      });
    });
  }

  createSP(storePoints){
    let counter = 0;
    storePoints.map(i => {
      this.storePointsProvider.createStorePoints(i).subscribe((successStorePoint) => {
        counter ++;
        console.log('COUNTER ==> ', counter, successStorePoint.length);

        if (counter == storePoints.length){
          this.uploadSR();
        }
      });
    });
  }

  uploadSR(){
    this.databaseprovider.getUploadedStoreRewards().then((storeRewards) => {
      let imageUrls = [];
      storeRewards.map(j => {
        imageUrls.push(j.imageUrl);
      });
      this.uploadProvider.upload(imageUrls).subscribe((data) => {
        this.createSR(storeRewards);
      }, (error) => {
        if (error.http_status == 200){
          this.createSR(storeRewards);
        }
      });
    });
  }

  createSR(storeRewards){
    let counter = 0;
    storeRewards.map(i => {
      this.storeRewardsProvider.createStoresRewards(i).subscribe((successStorePoint) => {
        counter ++;
        if (counter == storeRewards.length){
          // this.changeUploadedStatus();
        }
      });
    });
  }

  changeUploadedStatus(){
    this.databaseprovider.updateUploadedStatus().then((data) => {
      console.log('FINISH UPDATED UPLOAD ', data);
    });
  }

  logout(){
    this.loading = this.loadingCtrl.create({
      content: 'ចាកចេញពីកម្មវីធី',
    });

    this.loading.present();
    this.storage.remove('userdata');
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  }

  refresh(){
    this.loading = this.loadingCtrl.create({
      content: 'រៀបចំសារជាថ្មី',
    });

    this.loading.present();
    setTimeout(() => {
      window.location.reload();
    }, 1000);

  }


}
