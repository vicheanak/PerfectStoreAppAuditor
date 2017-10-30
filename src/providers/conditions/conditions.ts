import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

@Injectable()
export class ConditionsProvider {

   getApiUrl : string = this.hostname.get() + "/conditions/";

  constructor(public http: Http, public hostname: HostNameProvider) {
    console.log('Hello ConditionsProvider Provider');
  }


  all(){
    this.getApiUrl = this.getApiUrl;
    return  this.http.get(this.getApiUrl)
    .map((res : Response ) =>{
      let data = res.json();
      return data.records;
    });
  }

}
