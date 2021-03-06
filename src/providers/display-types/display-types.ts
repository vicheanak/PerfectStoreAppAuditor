import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

@Injectable()
export class DisplayTypesProvider {

  getApiUrl : string = this.hostname.get() + "/display_types/";

  constructor(public http: Http, public hostname: HostNameProvider) {

  }

  allDisplayTypes(){
    this.getApiUrl = this.getApiUrl;
    return  this.http.get(this.getApiUrl)
    .map((res : Response ) =>{
      let data = res.json();
      return data.records;
    });
  }

  getDisplayType(id){
    let getUrl = this.getApiUrl + 'store_types/' + id;
    console.log('get url', getUrl);
    return  this.http.get(getUrl)
    .map((res : Response ) => {
      let data = res.json();
      return data;
    });
  }

}
