import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';


  @Injectable()
  export class RewardServicesProvider {

    getApiUrl : string = this.hostname.get() + "/rewards";

    constructor(public http: Http, public hostname: HostNameProvider) {

    }

    allRewards() {
      return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{

        let result = res.json();
        return result.records;
      });
    }

  }
