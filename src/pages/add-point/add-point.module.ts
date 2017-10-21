import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPointPage, CardDisplayComponent} from './add-point';
import { StorePointServicesProvider } from '../../providers/store-point-services/store-point-services';


@NgModule({
  declarations: [
    AddPointPage,
    CardDisplayComponent
  ],
  entryComponents: [CardDisplayComponent],
  imports: [
    IonicPageModule.forChild(AddPointPage),
  ],
  providers: [
    StorePointServicesProvider
  ]
})
export class AddPointPageModule {}
