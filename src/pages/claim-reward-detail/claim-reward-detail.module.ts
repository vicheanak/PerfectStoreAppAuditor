import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimRewardDetailPage } from './claim-reward-detail';

@NgModule({
  declarations: [
    ClaimRewardDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimRewardDetailPage),
  ],
})
export class ClaimRewardDetailPageModule {}
