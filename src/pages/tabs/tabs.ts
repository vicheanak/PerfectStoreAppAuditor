import { Component } from '@angular/core';

import { SettingPage } from '../setting/setting';
import { DisplayPage } from '../display/display';
import { HomePage } from '../home/home';
import { RewardsPage} from '../rewards/rewards'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = DisplayPage;
  tab3Root = RewardsPage;
  tab4Root = SettingPage;


  constructor() {

  }
}
