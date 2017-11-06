import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import {DatabaseProvider} from '../../providers/database/database';
import {StoreTypesProvider} from '../../providers/store-types/store-types';


@Component({
  selector: 'page-display',
  templateUrl: 'display.html'
})
export class DisplayPage {

  displays: any = [];
  displayTypes: any = [];
  displayType1 = {};
  displayType2 = {};
  displayType3 = {};
  storeTypes = [];

  constructor(
    public navCtrl: NavController,
    // public databaseprovider: DatabaseProvider,
    public storeTypesProvider: StoreTypesProvider
    ) {

  }

  ionViewDidEnter(){
    // this.databaseprovider.getAllStoreTypes().then(data => {
    //   this.storeTypes = data;
    // });
    this.storeTypesProvider.allStoreTypes().subscribe((data) => {
      this.storeTypes = data;
    });

  }

  goToDetail(storeType){
    this.navCtrl.push('DisplayDetailPage', {
      id: storeType.id,
      name: storeType.name
    });
  }

}
