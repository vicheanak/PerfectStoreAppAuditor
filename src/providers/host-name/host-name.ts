import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HostNameProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HostNameProvider {

  constructor(public http: Http) {
    console.log('Hello HostNameProvider Provider');
  }

  get(){

    return 'http://192.168.8.102:3000';
    // return 'http://192.168.100.88:3000';
    // return 'http://172.17.96.162:3000';
    // return 'http://192.168.2.1:3000';
    // return 'http://localhost:3000';
    // return 'https://api.unileverstore.com';
  }

}
