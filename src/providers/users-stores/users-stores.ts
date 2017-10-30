import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';

/*
  Generated class for the UsersStoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class UsersStoresProvider {

    getApiUrl : string = this.hostname.get() + "/users_stores/users/";

    constructor(public http: Http, public hostname: HostNameProvider) {

    }

    getUsersStores(id) {
      this.getApiUrl = this.getApiUrl + id;
      return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{
        console.log('get user store');
        let usersStores = res.json();
        return usersStores.records;
      });
    }
  }
