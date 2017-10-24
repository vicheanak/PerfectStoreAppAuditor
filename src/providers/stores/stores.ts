import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StoresProvider {

 // getApiUrl : string = "http://localhost:3000/stores/";
 getApiUrl : string = "https://api.unilever.store/stores/";
 // getApiUrl : string = "http://192.168.8.103:3000/stores/";

  constructor(public http: Http) {

  }

  getStore(id) {
    let getUrl = this.getApiUrl + id;
    return  this.http.get(getUrl)
      .map((res : Response ) =>{
        return res.json();
      });
  }
}
