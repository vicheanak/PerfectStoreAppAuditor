import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the StoreDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-store-detail',
  templateUrl: 'store-detail.html',
})
export class StoreDetailPage {
  storePoints: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoreDetailPage');
    this.storePoints = [
            {
                date: '13/09/2017',
                points: 3600,
            },
            {
                date: '13/09/2017',
                points: 4000,
            },
            {
                date: '13/09/2017',
                points: 2500,
            },
            {
                date: '13/09/2017',
                points: 3100,
            },
            {
                date: '13/09/2017',
                points: 4000,
            },
            {
                date: '13/09/2017',
                points: 2500,
            },
            {
                date: '13/09/2017',
                points: 3100,
            }
            ,
            {
                date: '13/09/2017',
                points: 4000,
            },
            {
                date: '13/09/2017',
                points: 2500,
            },
            {
                date: '13/09/2017',
                points: 3100,
            },
            {
                date: '13/09/2017',
                points: 4000,
            },
            {
                date: '13/09/2017',
                points: 2500,
            },
            {
                date: '13/09/2017',
                points: 3100,
            },
            {
                date: '13/09/2017',
                points: 4000,
            },
            {
                date: '13/09/2017',
                points: 2500,
            },
            {
                date: '13/09/2017',
                points: 3100,
            },
            {
                date: '13/09/2017',
                points: 4000,
            },
            {
                date: '13/09/2017',
                points: 2500,
            },
            {
                date: '13/09/2017',
                points: 3100,
            }

        ];
  }

  pointDetail(){
    this.navCtrl.push('PointDetailPage');
  }

}
