import { Component } from '@angular/core';

/**
 * Generated class for the ConditionModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'condition-modal',
  templateUrl: 'condition-modal.html'
})
export class ConditionModalComponent {

  text: string;

  constructor() {
    console.log('Hello ConditionModalComponent Component');
    this.text = 'Hello World';
  }

}
