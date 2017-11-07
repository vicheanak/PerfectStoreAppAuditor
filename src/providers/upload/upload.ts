import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HostNameProvider} from '../../providers/host-name/host-name';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
declare var cordova: any;
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UploadProvider {

  url : string = this.hostname.get() + "/store_points_upload/";

  constructor(
    public http: Http,
    public hostname: HostNameProvider,
    private file: File,
    private filePath: FilePath,
    private transfer: Transfer
    ) {

  }

  upload(imageUrls) {
    let uploadArr = [];
    for (let i = 0; i < imageUrls.length; i ++){
      uploadArr.push({
        targetPath: this.pathForImage(imageUrls[i]),
        option: {
          fileKey: "file",
          fileName: imageUrls[i],
          chunkedMode: false,
          mimeType: "multipart/form-data",
          params : {'fileName': imageUrls[i]}
        }
      });
    }


    const fileTransfer: TransferObject = this.transfer.create();
    let counter = 0;
    return Observable.forkJoin(
      uploadArr.map(i => fileTransfer.upload(i.targetPath, this.url, i.option).then(data => {
        counter ++;
        console.log('SUCCESS UPLOAD ', counter);
      }))
      );
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
}
