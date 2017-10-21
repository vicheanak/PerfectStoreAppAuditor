import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPointPage, SanitizeHtmlPipe, CardDisplayComponent, AlertSuccessComponent, AlertDangerComponent } from './add-point';
import { StorePointServicesProvider } from '../../providers/store-point-services/store-point-services';


@NgModule({
  declarations: [
    AddPointPage,
    SanitizeHtmlPipe,
    AlertSuccessComponent,
    AlertDangerComponent,
    CardDisplayComponent
  ],
  entryComponents: [AlertDangerComponent, CardDisplayComponent, AlertSuccessComponent],
  imports: [
    IonicPageModule.forChild(AddPointPage),
  ],
  providers: [
    StorePointServicesProvider
  ]
})
export class AddPointPageModule {}
