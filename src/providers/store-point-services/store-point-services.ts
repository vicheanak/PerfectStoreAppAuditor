import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StorePointServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class StorePointServicesProvider {

    // getApiUrl : string = "http://localhost:3000/store_points/";
    // getApiUrl : string = "https://api.unilever.store/store_points";
    getApiUrl : string = "http://192.168.8.103:3000/store_points/";

    constructor(public http: Http) {

    }

    getStorePoints() {
      return  this.http.get(this.getApiUrl)
      .map((res : Response ) =>{
        console.log('map --> ', res.json());
      });
    }

    getStorePointsByStore(id) {
      let storeApiUrl = this.getApiUrl + 'stores/' + id;
      return  this.http.get(storeApiUrl)
      .map((res : Response ) =>{
        console.log('map --> ', res.json());
        return res.json();
      });
    }

    getStoreSum(id){
      let sumStoreUrl = this.getApiUrl + 'store_sum/' + id;
      return  this.http.get(sumStoreUrl)
      .map((res : Response ) =>{
        return res.json();
      });
    }

    getStoreEarned(id){
      let sumStoreUrl = this.getApiUrl + 'store_earned/' + id;
      return  this.http.get(sumStoreUrl)
      .map((res : Response ) =>{
        return res.json();
      });
    }

    getStoreSpent(id){
      let sumStoreUrl = this.getApiUrl + 'store_spent/' + id;
      return  this.http.get(sumStoreUrl)
      .map((res : Response ) =>{
        return res.json();
      });
    }

    getStoreRemaining(id){
      let sumStoreUrl = this.getApiUrl + 'store_remaining/' + id;
      return  this.http.get(sumStoreUrl)
      .map((res : Response ) =>{
        return res.json();
      });
    }

    createStorePoints(data){
      return  this.http.post(this.getApiUrl, data)
      .map((res : Response ) =>{
        console.log('map --> ', res.json());
      });
    }

  }
