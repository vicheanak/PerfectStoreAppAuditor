import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StoreTypesProvider {

  // getApiUrl : string = "http://localhost:3000/store_types/";
  // getApiUrl : string = "https://api.unilever.store/store_types/";
  getApiUrl : string = "http://192.168.8.103:3000/store_types/";

  constructor(public http: Http) {

  }

  allStoreTypes(){
    this.getApiUrl = this.getApiUrl;
    return  this.http.get(this.getApiUrl)
    .map((res : Response ) =>{
      let data = res.json();
      return data.records;
    });
  }

}
