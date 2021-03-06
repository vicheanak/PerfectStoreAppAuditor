import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

@Injectable()
export class DisplaysProvider {

  getApiUrl : string = this.hostname.get() + "/displays/";

  constructor(public http: Http, public hostname: HostNameProvider) {

  }

  allDisplays(){
    this.getApiUrl = this.getApiUrl;
    return  this.http.get(this.getApiUrl)
    .map((res : Response ) =>{
      let data = res.json();
      return data.records;
    });
  }

  getDisplay(id){
    const getUrl = this.getApiUrl + id;
    return  this.http.get(getUrl)
    .map((res : Response ) =>{
      let data = res.json();
      return data;
    });
  }

}
