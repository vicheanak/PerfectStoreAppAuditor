import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

  @Injectable()
  export class StoreImagesProvider {
    getApiUrl : string = this.hostname.get() + "/store_images/stores/";
    postApiUrl : string = this.hostname.get() + "/store_images/";

    constructor(public http: Http, public hostname: HostNameProvider) {

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
