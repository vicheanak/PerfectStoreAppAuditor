import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter,
    private storage: Storage,
    private sqlite: SQLite,
    private platform: Platform,
    private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.storage.get('database_filled').then(val => {
          // this.fillDatabase();
          if (val) {
            this.databaseReady.next(true);
          } else {
            this.fillDatabase();
          }
        });
      });
    });
  }

  fillDatabase() {
    this.http.get('assets/dummyDump.sql')
    .map(res => res.text())
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
      .then(data => {
        this.databaseReady.next(true);
        this.storage.set('database_filled', true);
      })
      .catch(e => {
        console.log('error =====> ', e);
      });
    });
  }


  addStoreImage(id, imageUrl, capturedAt, lat, lng, uploaded, storeIdStoreImages) {
    let data = [id, imageUrl, capturedAt, lat, lng, uploaded, storeIdStoreImages];
    let updateData = [imageUrl, capturedAt, lat, lng, uploaded, storeIdStoreImages, id];

    return this.database.executeSql("UPDATE STORE_IMAGEs SET imageUrl = ?, capturedAt = ?, lat = ?, lng = ?, uploaded = ?, storeIdStoreImages = ? WHERE id = ?", updateData).then(data1 => {
      if (data1.rows.rowsAffected){
        return data1;
      }
      else{
        return this.database.executeSql("INSERT INTO STORE_IMAGEs (id, imageUrl, capturedAt, lat, lng, uploaded, storeIdStoreImages) VALUES (?, ?, ?, ?, ?, ?, ?)", data).then(data2 => {
          return data2;
        }, err => {
          console.log('Error: ', err);
          return err;
        });
      }
    }, err => {
      console.log('Error: ', err);
      return err;
    });


  }



  getUploadedStoreImages() {
    return this.database.executeSql("SELECT * FROM STORE_IMAGEs WHERE uploaded = ?", [false]).then((data) => {
      let results = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          results.push({
            id: data.rows.item(i).id,
            imageUrl: data.rows.item(i).imageUrl,
            capturedAt: data.rows.item(i).capturedAt,
            lat: data.rows.item(i).lat,
            lng: data.rows.item(i).lng,
            uploaded: data.rows.item(i).uploaded,
            storeIdStoreImages: data.rows.item(i).storeIdStoreImages,
          });
        }
      }
      return results;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getAllStoreImages() {
    return this.database.executeSql("SELECT * FROM STORE_IMAGEs", []).then((data) => {
      let results = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          results.push({
            id: data.rows.item(i).id,
            imageUrl: data.rows.item(i).imageUrl,
            capturedAt: data.rows.item(i).capturedAt,
            lat: data.rows.item(i).lat,
            lng: data.rows.item(i).lng,
            uploaded: data.rows.item(i).uploaded,
            storeIdStoreImages: data.rows.item(i).storeIdStoreImages,
          });
        }
      }
      return results;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  addStorePoint(id, points, imageUrl, uploaded, storeIdStorePoints, userIdStorePoints, displayIdStorePoints, storeImageIdStorePoints, conditionIdStorePoints) {
    let data = [id, points, imageUrl, uploaded, storeIdStorePoints, userIdStorePoints, displayIdStorePoints, storeImageIdStorePoints, conditionIdStorePoints];
    let updateData =[points, imageUrl, uploaded, storeIdStorePoints, userIdStorePoints, displayIdStorePoints, storeImageIdStorePoints, conditionIdStorePoints, id];

    return this.database.executeSql("SELECT * FROM STORE_POINTs WHERE id = ?", [id]).then((data3) => {
      console.log('ADD_STORE_POINT', data3.rows);
      if (data3.rows.length){
        return this.database.executeSql("UPDATE STORE_POINTs SET points = ?, imageUrl = ?, uploaded = ?, storeIdStorePoints = ?, userIdStorePoints = ?, displayIdStorePoints = ?, storeImageIdStorePoints = ?, conditionIdStorePoints = ? WHERE id = ?", updateData).then(data1 => {
          console.log('UPDATE STORE_POINTs SUCCESS', data1.rows);
          return data1;
        }, err => {
          console.log('Error Updated: ', err);
          return err;
        });
      }
      else{
        return this.database.executeSql("INSERT INTO STORE_POINTs (id, points, imageUrl, uploaded, storeIdStorePoints, userIdStorePoints, displayIdStorePoints, storeImageIdStorePoints, conditionIdStorePoints) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data2 => {
          console.log('INSERT STORE_POINTs SUCCESS', data2.rows);
          return data2;
        }, err => {
          console.log('Error Inserted: ', err);
          return err;
        });
      }
    });
  }

  getAllStorePoints() {
    return this.database.executeSql(`SELECT * FROM STORE_POINTs`, []).then((data) => {
      let results = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          results.push({
            id: data.rows.item(i).id,
            uuid: data.rows.item(i).uuid,
            points: data.rows.item(i).points,
            imageUrl: data.rows.item(i).imageUrl,
            uploaded: data.rows.item(i).uploaded,
            storeIdStorePoints: data.rows.item(i).storeIdStorePoints,
            userIdStorePoints: data.rows.item(i).storeImageIdStorePoints,
            displayIdStorePoints: data.rows.item(i).displayIdStorePoints,
            storeImageIdStorePoints: data.rows.item(i).storeImageIdStorePoints,
            conditionIdStorePoints: data.rows.item(i).conditionIdStorePoints,
          });
        }
      }
      return results;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getUploadedStorePoints(){
    return this.database.executeSql(`SELECT * FROM STORE_POINTs WHERE uploaded = ?`, [false]).then((data) => {
      let results = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          results.push({
            id: data.rows.item(i).id,
            uuid: data.rows.item(i).uuid,
            points: data.rows.item(i).points,
            imageUrl: data.rows.item(i).imageUrl,
            uploaded: data.rows.item(i).uploaded,
            storeIdStorePoints: data.rows.item(i).storeIdStorePoints,
            userIdStorePoints: data.rows.item(i).userIdStorePoints,
            displayIdStorePoints: data.rows.item(i).displayIdStorePoints,
            storeImageIdStorePoints: data.rows.item(i).storeImageIdStorePoints,
            conditionIdStorePoints: data.rows.item(i).conditionIdStorePoints,
          });
        }
      }
      return results;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getStorePointsSum(id){
    return this.database.executeSql(`SELECT sp.id, si.capturedAt, si.storeIdStoreImages as storeId, si.id as storeImageId, sum(sp.points) as total_points
      FROM STORE_POINTs AS sp INNER JOIN STORE_IMAGEs AS si ON sp.storeImageIdStorePoints = si.id
      WHERE sp.storeIdStorePoints = ? GROUP BY sp.storeImageIdStorePoints ORDER BY datetime(si.capturedAt) DESC`, [id]).then((data) => {
        let results = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            results.push({
              id: data.rows.item(i).id,
              capturedAt: data.rows.item(i).capturedAt,
              total_points: data.rows.item(i).total_points,
              storeImageId: data.rows.item(i).storeImageId,
              storeId: data.rows.item(i).storeId
            });
          }
        }
        return results;
      }, err => {
        console.log('Error: ', err);
        return [];
      });
    }

    getStoreTotalPoints(id){
      return this.database.executeSql(`SELECT sp.id, si.capturedAt, si.storeIdStoreImages as storeId, si.id as storeImageId, sum(sp.points) as total_points
        FROM STORE_POINTs AS sp INNER JOIN STORE_IMAGEs AS si ON sp.storeImageIdStorePoints = si.id
        WHERE sp.storeIdStorePoints = ? GROUP BY sp.storeIdStorePoints ORDER BY datetime(si.capturedAt) DESC`, [id]).then((data) => {
          let results = [];
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              results.push({
                id: data.rows.item(i).id,
                capturedAt: data.rows.item(i).capturedAt,
                total_points: data.rows.item(i).total_points,
                storeImageId: data.rows.item(i).storeImageId,
                storeId: data.rows.item(i).storeId
              });
            }
          }
          return results;
        }, err => {
          console.log('Error: ', err);
          return [];
        });
      }


      getStorePointByStoreImage(storeImageId) {
        return this.database.executeSql(`SELECT
          sp.id,
          sp.points,
          sp.imageUrl,
          c.name as conditionName,
          c.id as conditionId,
          d.name as displayName,
          d.id as displayId,
          d.displayTypeIdDisplays as displayTypeId,
          d.sku as displaySku,
          si.capturedAt as capturedAt
          FROM STORE_POINTs as sp
          INNER JOIN STORE_IMAGEs as si ON si.id = sp.storeImageIdStorePoints
          INNER JOIN CONDITIONs as c ON c.id = sp.conditionIdStorePoints
          INNER JOIN DISPLAYs as d ON d.id = sp.displayIdStorePoints
          WHERE sp.storeImageIdStorePoints = ?`, [storeImageId]).then((data) => {
            let results = [];
            if (data.rows.length > 0) {
              for (var i = 0; i < data.rows.length; i++) {
                results.push({
                  id: data.rows.item(i).id,
                  display: {id: data.rows.item(i).displayId, name: data.rows.item(i).displayName},
                  name: data.rows.item(i).displayName,
                  sku: data.rows.item(i).displaySku,
                  imageUrl: data.rows.item(i).imageUrl,
                  points: data.rows.item(i).points,
                  conditionName: data.rows.item(i).conditionName,
                  conditionId: data.rows.item(i).conditionId,
                  condition: {id: data.rows.item(i).conditionId, name: data.rows.item(i).conditionName},
                  capturedAt: data.rows.item(i).capturedAt,
                  displayIdStorePoints: data.rows.item(i).displayId,
                  displayTypeId: data.rows.item(i).displayTypeId,
                });
              }
            }
            return results;
          }, err => {
            console.log('Error: ', err);
            return [];
          });
        }


        getStoreImage(storeImageId){
          return this.database.executeSql(`SELECT si.id, si.imageUrl, s.name
            FROM STORE_IMAGEs as si
            INNER JOIN STOREs as s ON si.storeIdStoreImages = s.id
            WHERE si.id = ?`, [storeImageId]).then((data) => {
              let results = [];
              if (data.rows.length > 0) {
                for (var i = 0; i < data.rows.length; i++) {
                  console.log('getStoreImage =======> ', data.rows.item(i));
                  results.push({
                    id: data.rows.item(i).id,
                    imageUrl: data.rows.item(i).imageUrl,
                    name: data.rows.item(i).name
                  });
                }
              }
              return results;
            }, err => {
              console.log('Error: ', err);
              return [];
            });
          }

          addStore(id, name, address, phone, lat, lng, status, uploaded, storeTypeIdStores, regionIdStores) {
            let data = [id, name, address, phone, lat, lng, status, uploaded, storeTypeIdStores, regionIdStores];
            let updateData =[name, address, phone, lat, lng, status, uploaded, storeTypeIdStores, regionIdStores, id];

            console.log('data in addStore databaseProvider ==> ', data);
            return this.database.executeSql("UPDATE STOREs SET name = ?, address = ?, phone = ?, lat = ?, lng = ?, status = ?, uploaded = ?, storeTypeIdStores = ?, regionIdStores = ? WHERE id = ?", updateData).then(data1 => {
              if (data1.rows.rowsAffected){
                return data1;
              }
              else{
                return this.database.executeSql("INSERT INTO STOREs (id, name, address, phone, lat, lng, status, uploaded, storeTypeIdStores, regionIdStores) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data2 => {
                  return data2;
                }, err => {
                  console.log('Error: ', err);
                  return err;
                });
              }
            }, err => {
              console.log('Error: ', err);
              return err;
            });

          }

          getAllStores() {
            return this.database.executeSql(`SELECT
              s.id,
              s.name,
              s.address,
              st.name as storeTypeName
              FROM STOREs AS s INNER JOIN STORE_TYPEs AS st ON st.id = s.storeTypeIdStores`, []).then((data) => {
                let results = [];
                console.log('ALL STORES ===> ', data.rows);
                if (data.rows.length > 0) {
                  for (var i = 0; i < data.rows.length; i++) {
                    results.push({
                      id: data.rows.item(i).id,
                      name: data.rows.item(i).name,
                      address: data.rows.item(i).address,
                      storeTypeName: data.rows.item(i).storeTypeName
                    });
                  }
                }
                return results;
              }, err => {
                console.log('Error: ', err);
                return [];
              });
            }

            getAllStoresGroup() {
              return this.database.executeSql(`SELECT
                s.id,
                s.name,
                s.address,
                st.name as storeTypeName,
                si.capturedAt
                FROM STORE_IMAGEs AS si
                INNER JOIN STOREs AS s ON si.storeIdStoreImages = s.id
                INNER JOIN STORE_TYPEs as st ON s.storeTypeIdStores = st.id
                GROUP BY si.storeIdStoreImages`, []).then((data) => {
                  let results = [];
                  console.log('ALL STORES ===> ', data.rows);
                  if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                      results.push({
                        id: data.rows.item(i).id,
                        name: data.rows.item(i).name,
                        address: data.rows.item(i).address,
                        storeTypeName: data.rows.item(i).storeTypeName,
                        capturedAt: data.rows.item(i).capturedAt
                      });
                    }
                  }
                  return results;
                }, err => {
                  console.log('Error: ', err);
                  return [];
                });
              }

              getStore(id) {
                let data = [id];
                return this.database.executeSql(`SELECT s.id, s.name, s.address, st.name as storeTypeName
                  FROM STOREs AS s INNER JOIN STORE_TYPEs AS st ON st.id = s.storeTypeIdStores WHERE s.id = ?`, data).then((data) => {
                    let results = [];
                    console.log('===> getStore function database.ts', data);
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                          address: data.rows.item(i).address,
                          storeTypeName: data.rows.item(i).storeTypeName
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addUser(id, fullname, username, phone, token, regionIdUsers) {
                  let data = [id, fullname, username, phone, token, regionIdUsers];
                  let updateData = [fullname, username, phone, token, regionIdUsers, id];

                  return this.database.executeSql("UPDATE USERs SET fullname = ?, username = ?, phone = ?, token = ?, regionIdUsers = ? WHERE id = ?", updateData).then(data1 => {
                    if (data1.rows.rowsAffected){
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO USERs (id, fullname, username, phone, token, regionIdUsers) VALUES (?, ?, ?, ?, ?, ?)", data).then(data2 => {
                        return data2;
                      }, err => {
                        console.log('Error: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error: ', err);
                    return err;
                  });
                }

                getAllUsers() {
                  return this.database.executeSql("SELECT * FROM USERs", []).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          fullname: data.rows.item(i).fullname,
                          username: data.rows.item(i).username,
                          phone: data.rows.item(i).phone,
                          token: data.rows.item(i).token,
                          regionIdUsers: data.rows.item(i).regionIdUsers,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addDisplay(id, name, points, imageUrl, status, sku, displayTypeIdDisplays, storeTypeIdDisplays) {
                  let data = [id, name, points, imageUrl, status, sku, displayTypeIdDisplays, storeTypeIdDisplays];
                  let updateData =[name, points, imageUrl, status, sku, displayTypeIdDisplays, storeTypeIdDisplays, id];

                  return this.database.executeSql("UPDATE DISPLAYs SET name = ?, points = ?, imageUrl = ?, status = ?, sku = ?, displayTypeIdDisplays = ?, storeTypeIdDisplays = ? WHERE id = ?", updateData).then(data1 => {
                    if (data1.rows.rowsAffected){
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO DISPLAYs (id, name, points, imageUrl, status, sku, displayTypeIdDisplays, storeTypeIdDisplays) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", data).then(data2 => {
                        return data2;
                      }, err => {
                        console.log('Error: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error: ', err);
                    return err;
                  });
                }

                getAllDisplays() {
                  return this.database.executeSql("SELECT * FROM DISPLAYs", []).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                          points: data.rows.item(i).points,
                          imageUrl: data.rows.item(i).imageUrl,
                          status: data.rows.item(i).status,
                          sku: data.rows.item(i).sku,
                          displayTypeIdDisplays: data.rows.item(i).displayTypeIdDisplays,
                          storeTypeIdDisplays: data.rows.item(i).storeTypeIdDisplays,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                getDisplay(displayId) {
                  return this.database.executeSql("SELECT * FROM DISPLAYs WHERE id = ?", [displayId]).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                          points: data.rows.item(i).points,
                          imageUrl: data.rows.item(i).imageUrl,
                          status: data.rows.item(i).status,
                          sku: data.rows.item(i).sku,
                          displayTypeIdDisplays: data.rows.item(i).displayTypeIdDisplays,
                          storeTypeIdDisplays: data.rows.item(i).storeTypeIdDisplays,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addDisplayType(id, name) {
                  let data = [id, name];
                  let updateData = [name, id];

                  return this.database.executeSql("UPDATE DISPLAY_TYPEs SET name = ? WHERE id = ?", updateData).then(data1 => {
                    if (data1.rows.rowsAffected){
                      this.getAllDisplayTypes();
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO DISPLAY_TYPEs (id, name) VALUES (?, ?)", data).then(data2 => {
                        return data2;
                      }, err => {
                        console.log('Error: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error: ', err);
                    return err;
                  });
                }

                getAllDisplayTypes() {
                  return this.database.executeSql("SELECT * FROM DISPLAY_TYPEs", []).then((data) => {
                    let results = [];
                    console.log('===>', data.rows.length);
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addCondition(id, name, displayIdConditions) {
                  let data = [id, name, displayIdConditions];
                  let updateData = [name, displayIdConditions, id];

                  return this.database.executeSql("UPDATE CONDITIONs SET name = ?, displayIdConditions = ? WHERE id = ?", updateData).then(data1 => {
                    if (data1.rows.rowsAffected){
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO CONDITIONs (id, name, displayIdConditions) VALUES (?, ?, ?)", data).then(data2 => {
                        return data2;
                      }, err => {
                        console.log('Error: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error: ', err);
                    return err;
                  });
                }

                getAllConditions() {
                  return this.database.executeSql("SELECT * FROM CONDITIONs", []).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                          displayIdConditions: data.rows.item(i).displayIdConditions,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                getConditionByDisplayId(displayId){
                  return this.database.executeSql("SELECT * FROM CONDITIONs WHERE displayIdConditions = ?", [displayId]).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                          displayIdConditions: data.rows.item(i).displayIdConditions,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addStoreType(id, name) {
                  let data = [id, name];
                  let updateData = [name, id];

                  return this.database.executeSql("UPDATE STORE_TYPEs SET name = ? WHERE id = ?", updateData).then(data1 => {
                    console.log('Data STORE_TYPEs ========= ', data1);
                    if (data1.rows.rowsAffected){
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO STORE_TYPEs (id, name) VALUES (?, ?)", data).then(data2 => {
                        console.log('INSERT STORE_TYPEs =======', data2);
                        return data2;
                      }, err => {
                        console.log('Error STORE_TYPEs INSERT: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error STORE_TYPEs UPDATE: ', err);
                    return err;
                  });

                }

                getAllStoreTypes() {
                  return this.database.executeSql("SELECT * FROM STORE_TYPEs", []).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addReward(id, name, points, imageUrl) {
                  let data = [id, name, points, imageUrl];
                  let updateData = [name, points, imageUrl, id];
                  return this.database.executeSql("UPDATE REWARDs SET name = ?, points = ?, imageUrl = ? WHERE id = ?", updateData).then(data1 => {
                    if (data1.rows.rowsAffected){
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO REWARDs (id, name, points, imageUrl) VALUES (?, ?, ?, ?)", data).then(data2 => {
                        return data2;
                      }, err => {
                        console.log('Error: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error: ', err);
                    return err;
                  });
                }

                getAllRewards() {
                  return this.database.executeSql("SELECT * FROM REWARDs", []).then((data) => {
                    let results = [];

                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {

                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name,
                          points: data.rows.item(i).points,
                          imageUrl: data.rows.item(i).imageUrl,
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addRegion(id, name) {
                  let data = [id, name];
                  let updateData = [name, id];

                  return this.database.executeSql("UPDATE REGIONs SET name = ? WHERE id = ?", updateData).then(data1 => {
                    if (data1.rows.rowsAffected){
                      return data1;
                    }
                    else{
                      return this.database.executeSql("INSERT INTO REGIONs (id, name) VALUES (?, ?)", data).then(data2 => {
                        return data2;
                      }, err => {
                        console.log('Error: ', err);
                        return err;
                      });
                    }
                  }, err => {
                    console.log('Error: ', err);
                    return err;
                  });

                }

                getAllRegions() {
                  return this.database.executeSql("SELECT * FROM REGIONs", []).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          name: data.rows.item(i).name
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                addStoreReward(id, status, imageUrl, spent_points, claimedAt, deliveriedAt, uploaded, storeIdStoresRewards, rewardIdStoresRewards) {
                  let data = [id, status, imageUrl, spent_points, claimedAt, deliveriedAt, uploaded, storeIdStoresRewards, rewardIdStoresRewards];
                  let updateData = [status, imageUrl, spent_points, claimedAt, deliveriedAt, uploaded, storeIdStoresRewards, rewardIdStoresRewards, id];
                  console.log('UPDATE DATA ===> ', updateData);
                  return this.database.executeSql("SELECT id FROM STORES_REWARDs WHERE id = ?", [id]).then(data0 => {
                    if (data0.rows.length){
                      return this.database.executeSql("UPDATE STORES_REWARDs SET status = ?, imageUrl = ?, spent_points = ?, claimedAt = ?, deliveriedAt = ?, uploaded = ?, storeIdStoresRewards = ?, rewardIdStoresRewards = ? WHERE id = ?", updateData).then(data1 => {
                        console.log('SUCCESS UPDATE');
                        return data1;
                      }, err => {
                        console.log('Error UPDATE: ', err);
                        return err;
                      });
                    }
                    else{
                      return this.database.executeSql("INSERT INTO STORES_REWARDs (id, status, imageUrl, spent_points, claimedAt, deliveriedAt, uploaded, storeIdStoresRewards, rewardIdStoresRewards) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data2 => {
                        console.log('SUCCESS INSERT');
                        return data2;
                      }, err => {
                        console.log('Error INSERT: ', err);
                        return err;
                      });
                    }
                  });
                }

                getAllStoreRewards() {
                  return this.database.executeSql("SELECT * FROM STORES_REWARDs", []).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          status: data.rows.item(i).status,
                          imageUrl: data.rows.item(i).imageUrl,
                          spent_points: data.rows.item(i).spent_points,
                          deliveriedAt: data.rows.item(i).deliveriedAt,
                          uploaded: data.rows.item(i).uploaded,
                          storeIdStoresRewards: data.rows.item(i).storeIdStoresRewards,
                          rewardIdStoresRewards: data.rows.item(i).rewardIdStoresRewards
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                getUploadedStoreRewards(){
                  return this.database.executeSql("SELECT * FROM STORES_REWARDs WHERE uploaded = ?", [false]).then((data) => {
                    let results = [];
                    if (data.rows.length > 0) {
                      for (var i = 0; i < data.rows.length; i++) {
                        results.push({
                          id: data.rows.item(i).id,
                          status: data.rows.item(i).status,
                          imageUrl: data.rows.item(i).imageUrl,
                          spent_points: data.rows.item(i).spent_points,
                          claimedAt: data.rows.item(i).claimedAt,
                          deliveriedAt: data.rows.item(i).deliveriedAt,
                          uploaded: data.rows.item(i).uploaded,
                          storeIdStoresRewards: data.rows.item(i).storeIdStoresRewards,
                          rewardIdStoresRewards: data.rows.item(i).rewardIdStoresRewards
                        });
                      }
                    }
                    return results;
                  }, err => {
                    console.log('Error: ', err);
                    return [];
                  });
                }

                updateUploadedStatus(){
                  return this.database.executeSql(`
                    UPDATE STORE_IMAGEs
                    SET uploaded = 'true'
                    WHERE
                    uploaded = 'false'
                    `, []).then((data1) => {
                      return this.database.executeSql(`
                        UPDATE STORE_POINTs
                        SET uploaded = 'true'
                        WHERE
                        uploaded = 'false'
                        `, []).then((data2) => {
                          return this.database.executeSql(`
                            UPDATE STORES_REWARDs
                            SET uploaded = 'true'
                            WHERE
                            uploaded = 'false'
                            `, []).then((data3) => {
                              console.log('FINISH UPDATED UPLOADED !!!');
                              return data3;
                            }, err => {
                              console.log('Error STORE_REWARDs: ', err);
                              return [];
                            });
                          }, err => {
                            console.log('Error STORE_POINTs: ', err);
                            return [];
                          });
                      }, err => {
                        console.log('Error STORE_IMAGEs: ', err);
                        return [];
                      });
                  }


                  getRemainingPoint(storeId){
                    return this.database.executeSql(`SELECT
                      sum(sp.points) as earnedPoints,
                      sum(sr.spent_points) as spentPoints
                      FROM STORES_REWARDs as sr INNER JOIN STOREs as s ON sr.storeIdStoresRewards = s.id
                      INNER JOIN STORE_POINTs as sp ON sp.storeIdStorePoints = s.id
                      WHERE sr.storeIdStoresRewards = ?`, [storeId]).then((data) => {
                        let results = [];

                        if (data.rows.length > 0) {
                          for (var i = 0; i < data.rows.length; i++) {
                            console.log('Item ===> ', data.rows.item(i));
                            results.push({
                              earnedPoints: data.rows.item(i).earnedPoints,
                              spentPoints: data.rows.item(i).spentPoints,
                              remainingPoints: data.rows.item(i).remainingPoints
                            });
                          }
                        }
                        return results;
                      }, err => {
                        console.log('Error: ', err);
                        return [];
                      });
                    }

                    getStoreRewards(storeId) {
                      return this.database.executeSql(`SELECT
                        sr.id as storeRewardId,
                        sr.status as storeRewardStatus,
                        sr.spent_points as storeRewardPoint,
                        r.name as rewardName,
                        sr.imageUrl as storeRewardImageUrl,
                        sr.claimedAt as storeRewardClaimedAt,
                        sr.deliveriedAt as storeRewardDeliveriedAt,
                        sr.storeIdStoresRewards as storeIdStoresRewards,
                        sr.rewardIdStoresRewards as rewardIdStoresRewards
                        FROM STORES_REWARDs as sr INNER JOIN REWARDs as r ON sr.rewardIdStoresRewards = r.id
                        WHERE sr.storeIdStoresRewards = ? ORDER BY datetime(sr.claimedAt) DESC`, [storeId]).then((data) => {
                          let results = [];

                          if (data.rows.length > 0) {
                            for (var i = 0; i < data.rows.length; i++) {
                              console.log('Item ===> ', data.rows.item(i));
                              results.push({
                                id: data.rows.item(i).storeRewardId,
                                status: data.rows.item(i).storeRewardStatus,
                                spent_points: data.rows.item(i).storeRewardPoint,
                                name: data.rows.item(i).rewardName,
                                imageUrl: data.rows.item(i).storeRewardImageUrl,
                                claimedAt: data.rows.item(i).storeRewardClaimedAt,
                                deliveriedAt: data.rows.item(i).storeRewardDeliveriedAt,
                                storeIdStoresRewards: data.rows.item(i).storeIdStoresRewards,
                                rewardIdStoresRewards: data.rows.item(i).rewardIdStoresRewards,
                              });
                            }
                          }
                          return results;
                        }, err => {
                          console.log('Error: ', err);
                          return [];
                        });
                      }

                      getDatabaseState() {
                        return this.databaseReady.asObservable();
                      }

                    }
