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

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  userData: any;
  loading: Loading;

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
    public storesProvider: StoresProvider
    ) {
    this.storage.get('userdata').then((userdata) => {
      if (userdata){
        this.userData = JSON.parse(userdata);
      }
    });
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
    let storeTypesLoad = false;

    this.conditionsProvider.all().subscribe((conditions) => {
      this.storage.set('condtions', JSON.stringify(conditions)).then(()=>{
        conditionLoad = true;
      });
    });


    this.usersStoresProvider.getUsersStores(this.userData.id).subscribe((usersStores) => {
      this.storage.set('usersStores', JSON.stringify(usersStores)).then(()=>{
        let countArr = 0;
        usersStores.map(i => {
          this.storesProvider.getStore(i.storeIdUsersStores).subscribe((store) => {
            this.storage.set('store-'+i.storeIdUsersStores, JSON.stringify(store)).then(()=>{
              countArr ++;
            });
          });
        });
        let interval = setInterval(() => {
          if (countArr == usersStores.length){
            userStoreLoad = true;
          }
        }, 300);
      });
    });

    this.displayTypesProvider.allDisplayTypes().subscribe((conditions) => {
      this.storage.set('displayTypes', JSON.stringify(conditions)).then(()=>{
        displayTypeLoad = true;
      });
    });

    this.storeTypesProvider.allStoreTypes().subscribe((storeTypes) => {
      this.storage.set('storeTypes', JSON.stringify(storeTypes)).then(()=>{
        storeTypesLoad = true;
      });
    });

    this.displaysProvider.allDisplays().subscribe((conditions) => {
      this.storage.set('displays', JSON.stringify(conditions)).then(()=>{
        displayLoad = true;
      });
    });

    this.rewardsProvider.allRewards().subscribe((rewards) => {
      this.storage.set('rewards', JSON.stringify(rewards)).then(()=>{
        rewardLoad = true;
      });
    })

    let checking = setInterval(()=>{
      if (conditionLoad && storeTypesLoad && displayLoad && displayTypeLoad && userStoreLoad && rewardLoad){
        clearInterval(checking);
        this.loading.dismissAll();
        this.presentToast('ទាញយកទិន្ន័យដោយជោគជ័យ');
      }
    }, 500);

    // this.storage.set('userdata', JSON.stringify(this.userData)).then(()=>{
      //   this.viewCtrl.dismiss(this.userData);
      // });
    }

    push(){

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
