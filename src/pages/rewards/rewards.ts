import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {RewardServicesProvider} from '../../providers/reward-services/reward-services';


/**
 * Generated class for the RewardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rewards',
  templateUrl: 'rewards.html',
})
export class RewardsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public rewardServices: RewardServicesProvider) {
  }

  ionViewDidLoad() {
    this.rewardServices.getRewards().subscribe((data) => {
    console.log('data service rewards', data);
    });
  }

    showConfirm() {
        let confirm = this.alertCtrl.create({
            title: 'ប្តូរយករង្វាន់នេះ?',
            buttons: [
                {
                    text: 'ទេ',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'ប្តូរ',
                    handler: () => {
                        console.log('Agree clicked');
                        this.navCtrl.parent.select(1);
                        //this.navCtrl.setPages([
                        //    { page: AboutPage }
                        //]);
                    }
                }
            ]
        });
        confirm.present();
    }

}
