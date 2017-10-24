import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DisplaysProvider {

  // getApiUrl : string = "http://localhost:3000/displays/";
  getApiUrl : string = "https://api.unilever.store/displays/";
  // getApiUrl : string = "http://192.168.8.103:3000/displays/";

  constructor(public http: Http) {

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
