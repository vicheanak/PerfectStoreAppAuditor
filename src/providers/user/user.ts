import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class UserProvider {

    // auditorUrl : string = "http://localhost:3000/auth_auditor/";
    // isAuditorUrl : string = "http://localhost:3000/is_auditor/";
    auditorUrl : string = "https://api.unilever.store/auth_auditor";
    isAuditorUrl : string = "https://api.unilever.store/is_auditor/";
    // auditorUrl : string = "http://192.168.8.103:3000/auth_auditor/";
    // isAuditorUrl : string = "http://192.168.8.103:3000/is_auditor/";

    constructor(public http: Http) {

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


  }
