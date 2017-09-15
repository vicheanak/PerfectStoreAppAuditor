import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    cardItems: any[];


    constructor(public navCtrl: NavController) {
        this.cardItems = [
            {
                storename: 'ឡុង ចិន្តា',
                storetype: 'FOOD GOLD',
                location: 'No. 55 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-bttf.png',
                content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
            },
            {
                storename: 'ហាក់ ស្រ៊ុន',
                storetype: 'SKINCARE GOLD',
                location: 'No. 91 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-tmntr.jpg',
                content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
            },
            {
                storename: 'សៀវ ហ្គិច',
                storetype: 'HPC GOLD',
                location: 'No. 103 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-jp.jpg',
                content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
            },
            {
                storename: 'ឡុង ចិន្តា',
                storetype: 'FOOD GOLD',
                location: 'No. 55 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-bttf.png',
                content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
            },
            {
                storename: 'ហាក់ ស្រ៊ុន',
                storetype: 'SKINCARE GOLD',
                location: 'No. 91 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-tmntr.jpg',
                content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
            },
            {
                storename: 'សៀវ ហ្គិច',
                storetype: 'HPC GOLD',
                location: 'No. 103 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-jp.jpg',
                content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
            },
            {
                storename: 'ឡុង ចិន្តា',
                storetype: 'FOOD GOLD',
                location: 'No. 55 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-bttf.png',
                content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
            },
            {
                storename: 'ហាក់ ស្រ៊ុន',
                storetype: 'SKINCARE GOLD',
                location: 'No. 91 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-tmntr.jpg',
                content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
            },
            {
                storename: 'សៀវ ហ្គិច',
                storetype: 'HPC GOLD',
                location: 'No. 103 ផ្លូវ វែងស្រ៊ុន',
                image: 'assets/img/advance-card-jp.jpg',
                content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
            }
        ];
  }

  viewStore(item) {
    this.navCtrl.push('StoreDetailPage', {
      item: item
    });
  }

  addPoint(item) {
    this.navCtrl.push('AddPointPage', {
      item: item
    });
  }

}
