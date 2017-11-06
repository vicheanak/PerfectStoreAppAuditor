import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DisplayTypesProvider} from '../../providers/display-types/display-types';
import { Storage } from '@ionic/storage';
declare var cordova: any;
import {HostNameProvider} from '../../providers/host-name/host-name';
/**
 * Generated class for the DisplayDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-display-detail',
  templateUrl: 'display-detail.html',
})
export class DisplayDetailPage {

  storeType: any;
  displayTypes: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public displayTypeProvider: DisplayTypesProvider,
    public storage: Storage,
    public hostname: HostNameProvider
    ) {
  }

  ionViewDidLoad() {
    this.storeType = this.navParams.data;
    this.storage.get('DISPLAY_TYPEs_'+this.storeType.id).then((data) => {
      let search = this.hostname.get()+'/public/uploads/';
      let replacement = cordova.file.dataDirectory;
      let dataRes = data;
      let datas = dataRes.replace(new RegExp(search, 'g'), replacement);
      datas = JSON.parse(datas);
      this.displayTypes = datas;
    });
    // this.displayTypeProvider.getDisplayType(this.storeType.id).subscribe((data) => {
    //   this.displayTypes = data;
    // });
  }

}
