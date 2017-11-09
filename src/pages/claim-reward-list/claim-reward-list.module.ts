import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimRewardListPage } from './claim-reward-list';

@NgModule({
  declarations: [
    ClaimRewardListPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimRewardListPage),
  ],
})
export class ClaimRewardListPageModule {}
