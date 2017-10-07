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
                date: '28/09/2017',
                points: 3600,
                edit: true
            },
            {
                date: '20/09/2017',
                points: 4000,
                edit: true
            },
            {
                date: '10/09/2017',
                points: 2500,
                edit: false
            },
            {
                date: '28/08/2017',
                points: 3100,
                edit: false
            },
            {
                date: '27/08/2017',
                points: 4000,
                edit: false
            },
            {
                date: '26/07/2017',
                points: 2500,
                edit: false
            },
            {
                date: '25/07/2017',
                points: 3100,
                edit: false
            }
            ,
            {
                date: '24/06/2017',
                points: 4000,
                edit: false
            },
            {
                date: '23/06/2017',
                points: 2500,
                edit: false
            },
            {
                date: '22/05/2017',
                points: 3100,
                edit: false
            },
            {
                date: '21/05/2017',
                points: 4000,
                edit: false
            },
            {
                date: '20/04/2017',
                points: 2500,
                edit: false
            },
            {
                date: '19/04/2017',
                points: 3100,
                edit: false
            },
            {
                date: '18/03/2017',
                points: 4000,
                edit: false
            },
            {
                date: '17/03/2017',
                points: 2500,
                edit: false
            },
            {
                date: '16/02/2017',
                points: 3100,
                edit: false
            },
            {
                date: '15/02/2017',
                points: 4000,
                edit: false
            },
            {
                date: '14/01/2017',
                points: 2500,
                edit: false
            },
            {
                date: '13/01/2017',
                points: 3100,
                edit: false
            }

        ];
  }

  pointDetail(){
    this.navCtrl.push('PointDetailPage');
  }

}
