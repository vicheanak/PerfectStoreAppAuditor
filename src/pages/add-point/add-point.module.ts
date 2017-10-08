import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPointPage } from './add-point';
import { StorePointServicesProvider } from '../../providers/store-point-services/store-point-services';

@NgModule({
  declarations: [
    AddPointPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPointPage),
  ],
  providers: [
    StorePointServicesProvider
  ]
})
export class AddPointPageModule {}
