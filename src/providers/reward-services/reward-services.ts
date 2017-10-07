import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RewardServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
 */
@Injectable()
export class RewardServicesProvider {

  getApiUrl : string = "http://localhost:3000/rewards";

  constructor(public http: Http) {
    console.log('Hello RewardServicesProvider Provider');
  }

  getRewards() {
    return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{
        console.log('map --> ', res.json());
      });
  }

  getAll(){
    console.log('test get all');
  }

}
