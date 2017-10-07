import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardsPage } from './rewards';
import { RewardServicesProvider } from '../../providers/reward-services/reward-services';

@NgModule({
  declarations: [
    RewardsPage,
  ],
  imports: [
    IonicPageModule.forChild(RewardsPage),
  ],
  providers: [
    RewardServicesProvider
  ]
})
export class RewardsPageModule {}
