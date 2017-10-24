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
    getApiUrl : string = "https://api.unilever.store/store_images/stores/";
    postApiUrl : string = "https://api.unilever.store/store_images/";
    // getApiUrl : string = "http://192.168.8.103:3000/store_images/stores/";
    // postApiUrl : string = "http://192.168.8.103:3000/store_images/";
    constructor(public http: Http) {

    }

    getStoreImage(id) {
      this.getApiUrl = this.getApiUrl + id;
      return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{
        return res.json();
      });
    }

    createStoreImage(data){
      return this.http.post(this.postApiUrl, data)
      .map((res : Response ) =>{
        return res.json();
      });
    }
  }
