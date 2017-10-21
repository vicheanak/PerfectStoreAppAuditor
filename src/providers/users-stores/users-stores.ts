import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UsersStoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class UsersStoresProvider {

    // getApiUrl : string = "http://localhost:3000/users_stores/users/";
    getApiUrl : string = "https://api.unilever.store/users_stores/users/";


    constructor(public http: Http) {
      console.log('Hello RewardServicesProvider Provider');
    }

    getUsersStores(id) {
      this.getApiUrl = this.getApiUrl + id;
      return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{
        let usersStores = res.json();

        return usersStores.records;
      });
    }
  }
