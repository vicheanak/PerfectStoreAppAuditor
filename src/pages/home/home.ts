import { Component } from '@angular/core';
import { NavController, AlertController, ModalController,  NavParams, ViewController  } from 'ionic-angular';
import {UserProvider} from '../../providers/user/user';
import {UsersStoresProvider} from '../../providers/users-stores/users-stores';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  cardItems: any[];
  displayName;
  userData: any;
  stores: any[];


  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public user: UserProvider,
    public usersStores: UsersStoresProvider,
    private storage: Storage) {

    this.cardItems = [
    {
      storename: 'ឡុង ចិន្តា',
      storetype: 'FOOD GOLD',
      location: 'No. 55 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-bttf.png',
      content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
    },
    {
      storename: 'ហាក់ ស្រ៊ុន',
      storetype: 'SKINCARE GOLD',
      location: 'No. 91 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-tmntr.jpg',
      content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
    },
    {
      storename: 'សៀវ ហ្គិច',
      storetype: 'HPC GOLD',
      location: 'No. 103 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-jp.jpg',
      content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
    },
    {
      storename: 'ឡុង ចិន្តា',
      storetype: 'FOOD GOLD',
      location: 'No. 55 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-bttf.png',
      content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
    },
    {
      storename: 'ហាក់ ស្រ៊ុន',
      storetype: 'SKINCARE GOLD',
      location: 'No. 91 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-tmntr.jpg',
      content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
    },
    {
      storename: 'សៀវ ហ្គិច',
      storetype: 'HPC GOLD',
      location: 'No. 103 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-jp.jpg',
      content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
    },
    {
      storename: 'ឡុង ចិន្តា',
      storetype: 'FOOD GOLD',
      location: 'No. 55 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-bttf.png',
      content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
    },
    {
      storename: 'ហាក់ ស្រ៊ុន',
      storetype: 'SKINCARE GOLD',
      location: 'No. 91 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-tmntr.jpg',
      content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
    },
    {
      storename: 'សៀវ ហ្គិច',
      storetype: 'HPC GOLD',
      location: 'No. 103 ផ្លូវ វែងស្រ៊ុន',
      image: 'assets/img/advance-card-jp.jpg',
      content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
    }
    ];
    // this.storage.clear();
    this.storage.get('userdata').then((userdata) => {
      if (userdata){
        this.userData = JSON.parse(userdata);
        this.user.isAuth(this.userData.token).subscribe((data) => {
          if (!data){
            this.showLogin();
          }
          else{
            this.usersStores.getUsersStores(this.userData.id).subscribe((stores)=>{
              this.stores = stores;
              console.log('this.stores ====> ', this.stores);
            });
          }
        });
      }
      else{
        this.showLogin();
      }
    });


  }

  signInWithFacebook() {

  }

  signOut() {

  }

  showLogin() {
    console.log('config is clicked');
    let modal = this.modalCtrl.create(LoginModal, {userId: '112'});
    modal.present();
  }

  viewStore(item) {
    this.navCtrl.push('StoreDetailPage', {
      item: item
    });
  }

  addPoint(item) {
    this.navCtrl.push('AddPointPage', {
      item: item
    });
  }

  viewClaimReward(item){
    this.navCtrl.push('ClaimRewardPage', {
      item: item
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

  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Error!',
      subTitle: msg,
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
        this.storage.set('userdata', JSON.stringify(this.userData));
        this.viewCtrl.dismiss();
      }

    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
