import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
import { Router, NavigationExtras } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({

  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: [
    './side-menu/styles/side-menu.scss',
    './side-menu/styles/side-menu.shell.scss',
    './side-menu/styles/side-menu.responsive.scss'
  ]
})

export class AppComponent {
  public counter = 0;
  notificationData: any;
  deviseId: any;
  notification_listing = [];
  count: any;
  alertshow: any;
  appPages = [
    {
      title: 'Home',
      url: 'categories',
      //  url: '/app/categories',
      src: 'assets/sidebarIcons/Home.svg'
    },
    {
      title: 'Air Conditioners',
      url: 'product',
      src: 'assets/sidebarIcons/Air-Conditiner.svg'
    },
    {
      title: 'Air Coolers',
      url: 'product',
      src: 'assets/sidebarIcons/Air-Cooler.svg'
    },
    {
      title: 'Deep Freezer',
      url: 'product',
      src: 'assets/sidebarIcons/Deep-Freezer.svg'
    },
    {
      title: 'Water Purifiers',
      url: 'product',
      src: 'assets/sidebarIcons/Water-Purifier.svg'
    },
   
    {
      title: 'Bottled Water Dispenser',
      url: 'product',
      src: 'assets/sidebarIcons/Bottled-Water-Dis.svg'
    },
    {
      title: 'Air Purifiers',
      url: 'product',
      src: 'assets/sidebarIcons/Air-Purifier.svg'
    },
    {
      title: 'Visi Cooler',
      url: 'product',
      src: 'assets/sidebarIcons/Visi-Cooler.svg'
    },
  ];
  accountPages = [
    // {
    //   title: 'Notifications',
    //   url: 'notifications',
    //   ionicIcon: 'notifications-outline'
    // },
    {
      title: 'Product Catalogue',
      url: 'product-catalogue',
      ionicIcon: 'book-outline'
    },
    {
      title: 'My Products',
      url: 'favourites',
      ionicIcon: 'heart-outline'
    },
    {
      title: 'Privacy Policy',
      url: 'privacy-policy',
      ionicIcon: 'document-outline'
    },
    {
      title: 'terms of use',
      url: 'terms-of-use',
      ionicIcon: 'clipboard-outline'
    },
    {
      title: 'Contact Us',
      url: 'contact-card',
      ionicIcon: 'call-outline'
    },
    {
      title: 'About',
      url: 'about',
      ionicIcon: 'information-outline'
    }
  ];

  // apiBaseUrl = "https://damuat.iksulalive.com";

  // apiBaseUrl = "https://damstage.iksulalive.com";

  
 
  // apiBaseUrl = "https://damstage.iksulalive.com"  // testing url

  apiBaseUrl = "https://dams.bluestarindia.com"  // production url

  url = this.apiBaseUrl + '/bluestar_api/category/all_product_details';

  productData = [];
  countNotification: any;

  databaseObj: SQLiteObject;
  readonly database_name: string = "bluestar_dealer.db";
  readonly table_air_conditioner: string = "air_conditioner";
  readonly table_air_cooler: string = "air_cooler";
  readonly table_air_purifier: string = "air_purifier";
  readonly table_water_purifier: string = "water_purifier";
  readonly table_deep_freezer: string = "deep_freezer";
  readonly table_bottled_water_dispenser: string = "bottled_water_dispenser";
  readonly table_visi_cooler: string = "visi_cooler";
  public onlineOffline: boolean = navigator.onLine;

  constructor(private router: Router,
    private http: HttpClient,
    private platform: Platform, private network: Network,
    private sqlite: SQLite, private push: Push, public alertController: AlertController,
    private storage: Storage, private androidPermissions: AndroidPermissions,
    private toastCtrl: ToastController) {

    this.initializeApp();
    // this.presentToastInternert('No internet connection. Please try again later');
    this.platform.ready().then(() => {

      // check internet connecion

      window.addEventListener('offline', () => {
        setTimeout(() => {
          if (!navigator.onLine)
            this.presentToastInternert('No internet connection. Please try again later.');
        }, 1000);
      });

      this.platform.backButton.subscribe(() => {
        if (this.router.url === '/categories') {
          //   navigator['app'].exitApp()
          // } else {
          //   this.presentAlertConfirm()
          // }
          if (this.counter == 0) {
            this.counter++;
            this.presentToast("Press again to exit");
            setTimeout(() => { this.counter = 0 }, 3000)
          }
          else {
            navigator['app'].exitApp()
          }
        }
      });

      if (this.platform.is('cordova')) {
        this.initPushNotification();
      }

      this.androidPermissions.requestPermissions(
        [
          androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
        ]
      );

      this.createDB();
    }).catch(error => {
      console.log(error);
    })
  }

  getcountNotification() {
    // this.loadingController.create({
    //   message: 'Please wait',
    // }).then((res) => {
    //   res.present();
    if (navigator.onLine) {
      this.http.get(this.apiBaseUrl + '/bluestar_api/notification_list').subscribe((response) => {
        Object.keys(response).map(key => {
          this.notification_listing = response[key].notification_listing;
          // console.log("notification_listing", this.notification_listing);
          let data = []
          this.storage.get('notificationList').then((val) => {
            // console.log("local storage notificationList", val);
            if (val == null) {
              this.storage.set('notificationList', this.notification_listing);
              this.countNotification = this.notification_listing.length;
              // console.log("countNotification", this.countNotification);
            } else {
              for (let i in this.notification_listing) {
                data = val;
                let count = 0;
                for (let index in data) {
                  if (data[index].ID == this.notification_listing[i].ID) {
                    count = 1;

                  }
                }
                if (count == 0) {
                  data.push(this.notification_listing[i])
                  this.storage.set('notificationList', data);
                }
              }

              setTimeout(() => {
                this.storage.get('notificationList').then((val) => {
                  data = val;
                  let count = 0;
                  for (let index in data) {
                    if (data[index].status) {
                      if (data[index].status != 'read') {
                        count++;
                      }
                    } else {
                      count++;
                    }
                  }
                  this.countNotification = count;
                  this.removeNotification();
                  // console.log("countNotification****", this.countNotification);
                })

              }, 500);

            }
          })
          // res.dismiss();
        })
      }, err => {
        // res.dismiss();
        console.log("err.........", JSON.stringify(err))
      });
    } else {
      // res.dismiss();
      console.log("no internat connection")
    }
    // });
    // let data = []
    // this.storage.get('notificationList').then((val) => {
    //   data = val;
    //   let count = 0;
    //   for (let index in data) {
    //     if (data[index].status) {
    //        if(data[index].status != 'read'){
    //           count++;
    //        }
    //     }else{
    //       count++;
    //     }
    //   }
    //   this.countNotification = count;
    //   console.log("menu", this.countNotification);
    // })
  }

  async initializeApp() {
    try {
      await SplashScreen.hide();
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  initPushNotification() {
    this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
      }
      else {
        console.log('We don\'t have permission to send push notifications');
      }
    });

    // to initialize push notifications
    const options: PushOptions = {
      android: {
        senderID: '747629397214',
        sound: 'true',
        vibrate: 'true',
        icon: 'ic_stat_onesignal_default'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      console.log("this.notificationData", notification);
      this.notificationData = notification.additionalData.data;

      if (notification.additionalData.foreground == true) {
        this.showNotificationPopup(notification)
      }else{
        console.log("click notification", notification.additionalData.id);
      }
    });
    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      localStorage.setItem('deviceId', registration.registrationId);
      this.deviseId = registration.registrationId;
      console.log('deviseId', this.deviseId);
      this.callDevideIdStoreApi();

    });
    pushObject.on('error').subscribe(error =>
      console.error('Error with Push plugin', error));
  }

  async showNotificationPopup(notification) {

    if (this.count == 1) {
      console.log("count if", this.count);
      this.alertshow.dismiss();
    }
    this.alertshow = await this.alertController.create({
      header: notification.title,
      // subHeader: "notification.title",
      message: notification.message,
      cssClass: 'notification-alert',
      buttons: [
        // {
        //   text: 'Cancel',
        //   role: 'cancel',
        //   cssClass: 'secondary',
        //   handler: () => {
        //     this.alertshow.dismiss();
        //   }
        // }, 
        {
          text: 'View',
          handler: () => {
            this.alertshow.dismiss();
            this.getNotificationList(notification.additionalData.id);
            // this.router.navigate(['/notifications']);
          }
        }
      ]
    });

    this.count = 1;
    console.log("count ***", this.count);
    await this.alertshow.present();
  }

  getNotificationList(notificationId) {
    // this.loadingController.create({
    //   message: 'Please wait',
    // }).then((res) => {
    //   res.present();
    if (navigator.onLine) {
      this.http.get(this.apiBaseUrl + '/bluestar_api/notification_list').subscribe((response) => {
        Object.keys(response).map(key => {
          this.notification_listing = response[key].notification_listing;
          let data = []
          this.storage.get('notificationList').then((val) => {
            if (val == null) {
              this.storage.set('notificationList', this.notification_listing);
              this.countNotification = this.notification_listing.length;
              console.log("show notification List 1");
            } else {
              for (let i in this.notification_listing) {
                data = val;
                let count = 0;
                for (let index in data) {
                  if (data[index].ID == this.notification_listing[i].ID) {
                    count = 1;

                  }
                }
                if (count == 0) {
                  data.push(this.notification_listing[i])
                  this.storage.set('notificationList', data);
                }
              }

              setTimeout(() => {
                this.storage.get('notificationList').then((val) => {
                  data = val;
                  let count = 0;
                  for (let index in data) {
                    if (data[index].status) {
                      if (data[index].status != 'read') {
                        count++;
                      }
                    } else {
                      count++;
                    }
                  }
                  this.countNotification = count;
                  this.removeNotification();
                })

              }, 500);
              // this.router.navigate(['/notifications']);
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  id: notificationId
                }
              };
              this.router.navigate(['notifications-view'], navigationExtras);
              console.log("show notification List 2");
            }
          })
          // res.dismiss();
        })
      }, err => {
        // res.dismiss();
        console.log("err.........", JSON.stringify(err));
        this.presentToastInternert('Internal server error');
      });
    } else {
      // res.dismiss();
      console.log("no internat connection");
      this.presentToastInternert('No internet connection. Please try again later.');
    }
    // });
  }

  removeNotification() {
    console.log("Eneter removeNotification");
    let data = [];
    let position = [];
    let newArr = [];
    this.storage.get('notificationList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          for (let index in data) {
            // console.log("index", index);
            let count = 0;
            let removeItemIndex = 0;
            for (let i in this.notification_listing) {
              // console.log("*****", data[index]);
              // console.log("notification_listing", this.notification_listing[i]);
              if (data[index].ID == this.notification_listing[i].ID) {
                count = 1;
                removeItemIndex = Number(index);
                position.push(removeItemIndex);
              }
            }
          }
          for (let j in position) {
            newArr.push(data[position[j]])
          }
          this.storage.set('notificationList', newArr);
          //  console.log("newArr", newArr);
        } else {
          this.storage.set('notificationList', []);
        }
      }
    });
  }

  callDevideIdStoreApi() {
    console.log("Enter callDevideIdStoreApi");
    this.http.post(this.apiBaseUrl + "/bluestar_api/get_app_device_ids", { device_id: this.deviseId }).subscribe((response) => {
    })
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      cssClass: "msg-align",
    });
    toast.present();
  }

  async presentToastInternert(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 8000,
      position: 'bottom',
      cssClass: "msg-align",
    });
    toast.present();
  }

  // Create DB if not there
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
        this.dropTable();
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });

    this.platform.backButton.subscribe(() => {
      if (this.router.url === '/categories') {
        //   navigator['app'].exitApp()
        // } else {
        //   this.presentAlertConfirm()
        // }
        if (this.counter == 0) {
          this.counter++;
          this.presentToast("Press again to exit");
          setTimeout(() => { this.counter = 0 }, 3000)
        }
        else {
          navigator['app'].exitApp()
        }
      }
    });
  }

  // callDevideIdStoreApi(deviseId) {
  //   this.http.post(this.apiBaseUrl + "/bluestar_api/get_app_device_ids", { device_id: deviseId }).subscribe((response) => {

  //   })
  // }

  // Dorp table
  dropTable() {
    let data: any;
    this.storage.get('dropTable').then((val) => {
      if (val != 1) {
        this.storage.set('dropTable', 1);
        data = val;
        this.droupTableAirConditioner();
        this.droupTableAirCooler();
        this.droupTableAirPurifier();
        this.droupTableWaterPurifier();
        this.droupTableDeepFreezer();
        this.droupTableBottledWaterDispenser();
        this.droupTableVisiCooler();


        this.createTableAirConditioner();
        this.createTableAirCooler();
        this.createTableAirPurifier();
        this.createTableWaterPurifier();
        this.createTableDeepFreezer();
        this.createTableBottledWaterDispenser();
        this.createTableVisiCooler();
        this.fetchAllCategoriesData()
      } else {
        this.storage.set('dropTable', 1);
        this.createTableAirConditioner();
        this.createTableAirCooler();
        this.createTableAirPurifier();
        this.createTableWaterPurifier();
        this.createTableDeepFreezer();
        this.createTableBottledWaterDispenser();
        this.createTableVisiCooler();
        this.fetchAllCategoriesData()
      }
    })
  }

  droupTableAirConditioner() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_air_conditioner}
    `, [])
      .then(() => {
        console.log('table_air_conditioner Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  droupTableAirCooler() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_air_cooler}
    `, [])
      .then(() => {
        console.log('table_air_cooler Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  droupTableAirPurifier() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_air_purifier}
    `, [])
      .then(() => {
        console.log('table_air_purifier Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  droupTableWaterPurifier() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_water_purifier}
    `, [])
      .then(() => {
        console.log('table_water_purifier Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  droupTableDeepFreezer() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_deep_freezer}
    `, [])
      .then(() => {
        console.log('table_deep_freezer Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  droupTableBottledWaterDispenser() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_bottled_water_dispenser}
    `, [])
      .then(() => {
        console.log('table_bottled_water_dispenser Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  droupTableVisiCooler() {
    this.databaseObj.executeSql(`
    DROP TABLE IF EXISTS ${this.table_visi_cooler}
    `, [])
      .then(() => {
        console.log('table_visi_cooler Table Drop!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  // Create table
  createTableAirConditioner() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_air_conditioner}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), SubCategory varchar(255), 
    JsonData TEXT, Capacity varchar(255), Series varchar(255), StarRating varchar(255), Price INTEGER DEFAULT 0, brochures varchar(255))
    `, [])
      .then(() => {
        console.log('air_conditioner Table Created!###############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  createTableAirCooler() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_air_cooler}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), 
    JsonData TEXT, Capacity INTEGER, Type varchar(255), Price INTEGER DEFAULT 0, brochures varchar(255))
    `, [])
      .then(() => {
        console.log('table_air_cooler Table Created!###########');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  createTableAirPurifier() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_air_purifier}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), 
    JsonData TEXT, CADR varchar(255), CoverageArea varchar(255), Price INTEGER DEFAULT 0, brochures varchar(255))
    `, [])
      .then(() => {
        console.log('table_air_purifier Table Created!#############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  createTableWaterPurifier() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_water_purifier}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), 
    JsonData TEXT, Capacity varchar(255), Technology varchar(255), Price INTEGER DEFAULT 0, ModelName varchar(255), brochures varchar(255))
    `, [])
      .then(() => {
        console.log('table_water_purifier Table Created!#############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  createTableDeepFreezer() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_deep_freezer}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), 
    JsonData TEXT, Capacity varchar(255), Category varchar(255), Doors varchar(255), Refrigerant varchar(255), Technology varchar(255), Price INTEGER DEFAULT 0, ModelName varchar(255), brochures varchar(255))
    `, [])
      .then(() => {
        console.log('table_deep_freezer Table Created!#############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  createTableBottledWaterDispenser() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_bottled_water_dispenser}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), 
    JsonData TEXT, Capacity varchar(255),Series varchar(255), Colour varchar(255),Faucets varchar(255), Technology varchar(255), Price INTEGER DEFAULT 0, ModelName varchar(255), brochures varchar(255))
    `, [])
      .then(() => {
        console.log('table_bottled_water_dispenser Table Created!#############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  }

  createTableVisiCooler() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.table_visi_cooler}  (ID varchar(255) PRIMARY KEY, ProductTitle varchar(255), SKUCode varchar(500), Image varchar(255), 
    JsonData TEXT, Capacity varchar(255), Series varchar(255), Doors varchar(255), CoolingType varchar(255), Technology varchar(255), Price INTEGER DEFAULT 0, ModelName varchar(255), brochures varchar(255))
    `, [])
      .then(() => {
        console.log('table_visi_cooler Table Created!#############');
      })
      .catch(e => {
        console.log("error", JSON.stringify(e))
      });
  } 


  // insert Start
  insertRowInTableWaterPurifier(id, name, skuCode, image, jsonData, capacity, technology, price, modelName, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_water_purifier} (ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${jsonData}','${capacity}','${technology}','${price}','${modelName}','${brochures}')
    `, [])
      .then(() => {
        // console.log('Water Purifier Row Inserted!' + id);
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  insertRowInTableAirCooler(id, name, skuCode, image, jsonData, capacity, type, price, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_air_cooler} (ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Type, Price, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${jsonData}','${capacity}','${type}','${price}','${brochures}')
    `, [])
      .then(() => {
        //console.log('Row Inserted!');
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  insertRowInTableAirConditioner(id, name, skuCode, image, subCategory, jsonData, capacity, series, starRating, price, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_air_conditioner} (ID, ProductTitle, SKUCode, Image, SubCategory, JsonData, Capacity, Series, StarRating, Price, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${subCategory}','${jsonData}','${capacity}','${series}','${starRating}','${price}','${brochures}')
    `, [])
      .then(() => {
        //console.log('Row Inserted!');
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  insertRowInTableAirPurifier(id, name, skuCode, image, jsonData, card, coverageQrea, price, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_air_purifier} (ID, ProductTitle, SKUCode, Image, JsonData, CADR, CoverageArea, Price, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${jsonData}','${card}','${coverageQrea}','${price}','${brochures}')
    `, [])
      .then(() => {
        //console.log('Row Inserted!');
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }


  insertRowInTableDeepFreezer(id, name, skuCode, image, jsonData, capacity, category, doors, refrigerant, technology, price, modelName, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_deep_freezer} (ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Category, Doors, Refrigerant, Technology, Price, ModelName, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${jsonData}','${capacity}','${category}','${doors}','${refrigerant}','${technology}','${price}','${modelName}','${brochures}')
    `, [])
      .then(() => {
        //console.log('Row Inserted!');
        console.log('Deep Row Inserted!' , ", Id" + id ,", Capacity" + capacity, ", category" + category, ", Doors" + doors, ", refrigerant" + refrigerant);
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  insertRowInTableBottledWaterDispenser(id, name, skuCode, image, jsonData, capacity, series, colour, faucets, technology, price, modelName, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_bottled_water_dispenser} (ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Series, Colour, Faucets, Technology, Price, ModelName, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${jsonData}','${capacity}','${series}','${colour}','${faucets}','${technology}','${price}','${modelName}','${brochures}')
    `, [])
      .then(() => {
        //console.log('Row Inserted!');
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  insertRowInTableVisiCooler(id, name, skuCode, image, jsonData, capacity, series, doors, coolingType, technology, price, modelName, brochures) {
    this.databaseObj.executeSql(`
      INSERT INTO ${this.table_visi_cooler} (ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Series, Doors, CoolingType, Technology, Price, ModelName, brochures) VALUES 
      ('${id}','${name}','${skuCode}','${image}','${jsonData}','${capacity}','${series}','${doors}','${coolingType}','${technology}','${price}','${modelName}','${brochures}')
    `, [])
      .then(() => {
        //console.log('Row Inserted!');
        // console.log('Visi Cooler Row Inserted!' , ", Id" + id ,", Capacity" + capacity, ", Series" + series, ", Doors" + doors, ", coolingType" + coolingType);
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }
  // insert end

  getRows() {
    this.databaseObj.executeSql(`
    SELECT * FROM ${this.table_air_purifier}
    `
      , [])
      .then((res) => {
        let row_data = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            row_data.push(JSON.stringify(res.rows.item(i)));
          }
          console.log("row_data##############", row_data)
          this.productData = row_data;
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  refreseProductData() {
    this.fetchAirConditionerData({ air_conditioner: "Air Conditioner" })
    this.fetchAirCoolerData({ air_cooler: "Air Cooler" });
    this.fetchAirPurifierData({ air_purifier: "Air Purifier" });
    this.fetchWaterPurifierData({ water_purifier: "Water Purifier" });
    this.fetchDeepFreezerData({ deep_freezer: "Deep Freezer" });
    this.fetchBottledWaterDispenserData({ water_dispenser: "Bottled Water Dispenser" });
    this.fetchVisiCoolerData({ visi_cooler: "Visi Cooler" });
  }

  fetchAllCategoriesData() {
    if (navigator.onLine) {
      this.databaseObj.executeSql(`
    DELETE FROM ${this.table_air_conditioner}
    `
        , [])
        .then((res) => {
          this.fetchAirConditionerData({ air_conditioner: "Air Conditioner" })
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });


      this.databaseObj.executeSql(`
    DELETE FROM ${this.table_air_cooler}
    `
        , [])
        .then((res) => {
          this.fetchAirCoolerData({ air_cooler: "Air Cooler" });
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });


      this.databaseObj.executeSql(`
    DELETE FROM ${this.table_air_purifier}
    `
        , [])
        .then((res) => {
          this.fetchAirPurifierData({ air_purifier: "Air Purifier" });
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });


      this.databaseObj.executeSql(`
    DELETE FROM ${this.table_water_purifier}
    `
        , [])
        .then((res) => {
          this.fetchWaterPurifierData({ water_purifier: "Water Purifier" });
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });


        this.databaseObj.executeSql(`
    DELETE FROM ${this.table_deep_freezer}
    `
        , [])
        .then((res) => {
          this.fetchDeepFreezerData({ deep_freezer: "Deep Freezer" });
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });



        this.databaseObj.executeSql(`
    DELETE FROM ${this.table_bottled_water_dispenser}
    `
        , [])
        .then((res) => {
          this.fetchBottledWaterDispenserData({ water_dispenser: "Bottled Water Dispenser" });
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });


        this.databaseObj.executeSql(`
    DELETE FROM ${this.table_visi_cooler}
    `
        , [])
        .then((res) => {
          this.fetchVisiCoolerData({ visi_cooler: "Visi Cooler" });
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });


    } else {
      console.log("No internat connection")
    }
  }

  fetchAirConditionerData(param) {
    this.http.post(this.url, param).subscribe((response) => {
      //ID, ProductTitle, SKUCode, Image, SubCategory, JsonData, Capacity, Series, StarRating, Price
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let subCategory = ""
          let capacity = ""
          let series = ""
          let starRating = ""
          let price = 0
          let brochures = ""
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]
            if (data == "product_type") {
              subCategory = value[data][1]
            }
            if (data == "nominal_cooling_capacity") {
              capacity = value[data][1]
            }
            if (data == "series_name") {
              series = value[data][1]
            }
            if (data == "star_rating") {
              starRating = value[data][1]
            }
            if (data == "mrp") {
              price = value[data][1]
            }

            if (data == "brochures") {
              brochures = value[data]
            }

            if (data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableAirConditioner(id, name, skuCode, image, subCategory, jsonData, capacity, series, starRating, price, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }

  fetchAirCoolerData(param) {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Type, Price)
    this.http.post(this.url, param).subscribe((response) => {
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let capacity = 0
          let type = ""
          let price = 0
          let brochures = ""
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]

            if (data == "storage_capacity") {
              capacity = Number(value[data][1])
            }
            if (data == "mrp") {
              price = value[data][1]
            }
            if (data == "aircooler_type") {
              type = value[data][1]
            }

            if (data == "brochures") {
              brochures = value[data]
            }

            if (data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableAirCooler(id, name, skuCode, image, jsonData, capacity, type, price, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }

  fetchAirPurifierData(param) {
    this.http.post(this.url, param).subscribe((response) => {
      //(ID, ProductTitle, SKUCode, Image, json_data, CADR, CoverageArea, Price)
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let card = ""
          let coverageQrea = ""
          let price = 0
          let brochures = ""
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]

            if (data == "clean_air_delivery") {
              card = value[data][1]
            }
            if (data == "mrp") {
              price = value[data][1]
            }
            if (data == "area_cover") {
              coverageQrea = value[data][1]
            }

            if (data == "brochures") {
              brochures = value[data]
            }

            if (data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableAirPurifier(id, name, skuCode, image, jsonData, card, coverageQrea, price, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }

  fetchWaterPurifierData(param) {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.http.post(this.url, param).subscribe((response) => {
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let capacity = ""
          let technology = ""
          let price = 0
          let modelName = ""
          let brochures = ""
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]

            if (data == "storage_capacity") {
              capacity = value[data][1]
            }
            if (data == "mrp_product") {
              price = value[data][1]
            }
            if (data == "purification_technology") {
              technology = value[data][1]
            }

            if (data == "model_series") {
              modelName = value[data][1]
            }
            if (data == "brochures") {
              brochures = value[data]
            }

            if (data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableWaterPurifier(id, name, skuCode, image, jsonData, capacity, technology, price, modelName, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }


  fetchDeepFreezerData(param) {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.http.post(this.url, param).subscribe((response) => {
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let capacity = 0
          let technology = ""
          let price = 0
          let modelName = ""
          let brochures = ""
          let doors = 0
          let refrigerant = ""
          let category = ""
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]

            if (data == "freezer_capacity") {
              capacity = Number(value[data][1])
            }
            if (data == "mrp_product") {
              price = value[data][1]
            }
            if (data == "purification_technology") {
              technology = value[data][1]
            }

            if (data == "model_series") {
              modelName = value[data][1]
            }
            if (data == "brochures") {
              brochures = value[data]
            }

            if (data == "df_number_of_doors") {
              doors = Number(value[data][1])
            }
            if (data == "refrigerant") {
              refrigerant = value[data][1]
            }
            if (data == "product_sub_type") {
              category = value[data][1]
            }

            if (data != "category" && data != "doors" && data != "refrigerant" && data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableDeepFreezer(id, name, skuCode, image, jsonData, capacity, category, doors, refrigerant, technology, price, modelName, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }


  fetchBottledWaterDispenserData(param) {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.http.post(this.url, param).subscribe((response) => {
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let capacity = 0
          let technology = ""
          let price = 0
          let modelName = ""
          let brochures = ""
          let series = ""
          let colour = ""
          let faucets = 0
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]

            if (data == "storage_capacity") {
              capacity = Number(value[data][1])
            }
            if (data == "mrp_product") {
              price = value[data][1]
            }
            if (data == "purification_technology") {
              technology = value[data][1]
            }
            if (data == "model_series") {
              modelName = value[data][1]
            }
            if (data == "brochures") {
              brochures = value[data]
            }

            if (data == "series_name") {
              series = value[data][1]
            }
            if (data == "color_name") {
              colour = value[data][1]
            }
            if (data == "number_of_faucets") {
              faucets = Number(value[data][1])
            }

            if (data != "Faucets" && data != "colour" && data != "series_name" &&  data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableBottledWaterDispenser(id, name, skuCode, image, jsonData, capacity, series, colour, faucets, technology, price, modelName, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }


  fetchVisiCoolerData(param) {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.http.post(this.url, param).subscribe((response) => {
      Object.keys(response).map(key => {
        for (let index in response[key].product_details) {
          let id = ""
          let name = ""
          let skuCode = ""
          let image = ""
          let value = response[key].product_details[index];
          let images = value.Image;
          let jsonData = ""
          let capacity = 0
          let technology = ""
          let price = 0
          let modelName = ""
          let brochures = ""
          let series = ""
          let doors = 0
          let coolingType = ""
          let productDetails = [];
          for (let data in value) {
            if (data == "product_name") {
              name = value[data][1]
            }
            if (data == "id") {
              id = value[data][1]
            }
            if (data == "sku_model_number") {
              skuCode = value[data][1]
            }
            image = images[0]

            if (data == "freezer_capacity") {
              capacity = Number(value[data][1])
            }
            if (data == "mrp_product") {
              price = value[data][1]
            }
            if (data == "purification_technology") {
              technology = value[data][1]
            }

            if (data == "model_series") {
              modelName = value[data][1]
            }
            if (data == "brochures") {
              brochures = value[data]
            }

            if (data == "product_sub_type") {
              series = value[data][1]
            }
            if (data == "df_number_of_doors") {
              doors = Number(value[data][1])
            }
            if (data == "df_cooling_type") {
              coolingType = value[data][1]
            }

            if (data != "product_sub_type" && data != "df_number_of_doors" && data != "df_cooling_type" &&  data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
              let object = {
                title: value[data][0],
                value: value[data][1]
              }
              productDetails.push(object)
            }
          }
          jsonData = JSON.stringify(productDetails);

          this.insertRowInTableVisiCooler(id, name, skuCode, image, jsonData, capacity, series, doors, coolingType, technology, price, modelName, brochures);
        }
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
  }

  goToProductListPage(text) {
    if (text == "Home") {
      this.router.navigate(['categories']);
    } else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          title: text
        }
      };
      this.router.navigate(['product'], navigationExtras);
    }
  }
}
