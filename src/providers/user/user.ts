import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

@Injectable()
export class UserProvider {
  auditorUrl : string = this.hostname.get() + "/auth_auditor";
  isAuditorUrl : string = this.hostname.get() + "/is_auditor/";
  getUrl : string = this.hostname.get() + "/auditors/";
  constructor(public http: Http, public hostname: HostNameProvider) {

  }

  auth(param){
    return this.http.put(this.auditorUrl, param)
    .map((res : Response ) =>{
      console.log('res json', res.json());
      return res.json();
    });
  }

  isAuth(token){
    this.isAuditorUrl = this.isAuditorUrl + token;
    return this.http.get(this.isAuditorUrl)
    .map((res : Response ) =>{
      console.log('res json', res.json());
      return res.json();
    });
  }

  changePassword(id, oldPassword, newPassword){
    let getAuditorUrl = this.getUrl + 'changepassword/' + id;
    let data = {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
    return this.http.put(getAuditorUrl, data)
    .map((res : Response ) =>{
      console.log('res json', res.json());
      return res.json();
    });
  }


}
