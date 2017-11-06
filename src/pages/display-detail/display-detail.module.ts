import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DisplayDetailPage } from './display-detail';

@NgModule({
  declarations: [
    DisplayDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DisplayDetailPage),
  ],
})
export class DisplayDetailPageModule {}
