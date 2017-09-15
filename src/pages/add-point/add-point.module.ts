import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPointPage } from './add-point';

@NgModule({
  declarations: [
    AddPointPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPointPage),
  ],
})
export class AddPointPageModule {}
