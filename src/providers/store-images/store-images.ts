import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StoreImagesProvider {

 // getApiUrl : string = "http://localhost:3000/store_images/stores/";
 getApiUrl : string = "https://api.unilever.store/store_images/stores";

  constructor(public http: Http) {
    console.log('Hello RewardServicesProvider Provider');
  }

  getStoreImage(id) {
    this.getApiUrl = this.getApiUrl + id;
    return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{
        return res.json();
      });
  }
}
