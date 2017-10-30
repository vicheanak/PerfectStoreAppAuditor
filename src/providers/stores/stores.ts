import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

@Injectable()
export class StoresProvider {
  getApiUrl : string = this.hostname.get() + "/stores/";

  constructor(public http: Http, public hostname: HostNameProvider) {

  }

  getStore(id) {
    let getUrl = this.getApiUrl + id;
    return  this.http.get(getUrl)
    .map((res : Response ) =>{
      return res.json();
    });
  }
}
