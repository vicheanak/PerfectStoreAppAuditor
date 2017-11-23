import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DisplayTypesProvider} from '../../providers/display-types/display-types';
import { Storage } from '@ionic/storage';
declare var cordova: any;
import {HostNameProvider} from '../../providers/host-name/host-name';
import {DatabaseProvider} from '../../providers/database/database';

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
    public hostname: HostNameProvider,
    public databaseprovider: DatabaseProvider,
    ) {
  }

  ionViewDidLoad() {
    this.storeType = this.navParams.data;
    this.databaseprovider.getAllDisplayTypes().then(displayTypes => {
      this.databaseprovider.getDisplayByStoreType(this.storeType.id).then((displays) => {
        this.displayTypes = displayTypes;
        for (let dt = 0; dt < displayTypes.length; dt ++){
          displayTypes[dt].DISPLAYs = [];
          for (let d = 0; d < displays.length; d ++){
            if (displayTypes[dt].id == displays[d].displayTypeIdDisplays){
              this.displayTypes[dt].DISPLAYs.push(displays[d]);
            }  
          }
          console.log("this.displayTypes", this.displayTypes);
        };
      });
    });
   
    // this.displayTypeProvider.getDisplayType(this.storeType.id).subscribe((data) => {
    //   this.displayTypes = data;
    // });
  }

}
