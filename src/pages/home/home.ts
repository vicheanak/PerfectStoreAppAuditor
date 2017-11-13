import { Component } from '@angular/core';
import { NavController, AlertController, ModalController,  NavParams, ViewController  } from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import {UsersStoresProvider} from '../../providers/users-stores/users-stores';

import { Storage } from '@ionic/storage';
import { DatabaseProvider } from './../../providers/database/database';
declare var cordova: any;
import moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cardItems: any[];
  displayName;
  userData: any;
  stores: any[];
  storeImages: any[];
  mymoment: any;


  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public usersStores: UsersStoresProvider,
    private storage: Storage,
    private databaseprovider: DatabaseProvider,
    ) {
    this.storage.get('userdata').then((userdata) => {
      if (userdata){
        this.userData = JSON.parse(userdata);
        this.user.isAuth(this.userData.token).subscribe((data) => {
          if (!data){
            this.showLogin();
          }
          else{
            this.getStores();
          }
        });
      }
      else{
        this.showLogin();
      }
    });
  }


  ionViewDidEnter(){
    this.getStores();
  }

  getStores(){
    this.databaseprovider.getAllStores().then(data1 => {
      this.stores = data1;
      this.databaseprovider.getAllStoresGroup().then(data2 => {
        this.storeImages = data2;
        this.stores.map((s) => {
          this.storeImages.map((si) => {
            if (s.id == si.id){
              s.capturedAt = si.capturedAt;
              let capturedAt = moment().month(si.capturedAt);
              let capturedMonthYear = capturedAt.format("YYYY-MM");
              let currentMonthYear = moment().format('YYYY-MM');
              if (capturedMonthYear == currentMonthYear){
                s.doneCaptured = true;
              }
            }
          })
        });
        console.log('STORES ==> Reenter', this.stores);
      });
    });
  }



  signInWithFacebook() {

  }

  signOut() {

  }

  showLogin() {
    console.log('config is clicked');

    let modal = this.modalCtrl.create(LoginModal, {userId: '112'});
    modal.onDidDismiss(data => {
      console.log('close modal sss', data);
      // this.usersStores.getUsersStores(data.id).subscribe((stores)=>{
        //   console.log('close modal', stores);
        //   this.stores = stores;
        // });
        this.databaseprovider.getAllStores().then(data => {
          this.stores = data;
          console.log('STORES ==> Close Modal', this.stores);
        });
      });
    modal.present();
  }

  viewStore(store) {
    this.navCtrl.push('StoreDetailPage', {
      id: store.id
    });
  }

  addPoint(item) {
    console.log('addPoint', item);
    this.navCtrl.push('AddPointPage', {
      id: item.id
    });
  }

  viewClaimReward(item){
    this.navCtrl.push('ClaimRewardPage', {
      store: item
    });
  }

}


@Component({templateUrl: 'login-modal.html'})

export class LoginModal {
  character;
  username: string;
  password: string;
  token: string;
  userData: any;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public user: UserProvider,
    private storage: Storage,
    public alertCtrl: AlertController,
    ) {
    // this.storage.clear();
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: msg,
      subTitle: 'សូមធ្វើការសាកល្បងម្តងទៀត',
      buttons: ['OK']
    });
    alert.present();
  }

  login(){
    let param = {
      username: this.username,
      password: this.password
    }
    this.user.auth(param).subscribe((data) => {
      console.log(data);
      if (data.err){
        this.showAlert(data.err);
      }
      else{
        this.userData = data;
        this.storage.set('userdata', JSON.stringify(this.userData)).then(()=>{
          this.viewCtrl.dismiss(this.userData);
        });
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
