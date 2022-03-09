import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { ProductListingModel } from './product-listing.model';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController, ModalController, PopoverController, ToastController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { AppShellPage } from '../../showcase/app-shell/app-shell.page';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { CategoriesPage } from "./../../categories/categories.page";
import { AppComponent } from "./../../app.component";
import { SharePopover } from '../../share-popover/share-popover';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PopupCompare } from '../../popup-compare/popup-compare';
import { popupcomparesamecategory } from '../../popup-compare-same-category/popup-compare-same-category';


import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from "./song.model";


@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.page.html',
  styleUrls: [
    './styles/product-listing.page.scss',
    './styles/product-listing.shell.scss'
  ]
})
export class ProductListingPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  data = [];
  subscriptions: Subscription;
  pdf_link: any;
  listing: ProductListingModel;
  title = '';
  product_listing = [];
  total_product: number;
  all_product_listing = []
  page = 1;
  pagenationProductCount = 20;

  //airPurifie filter selected option array
  airPurifierCoverageAreaSelected = []
  airPurifierCADRSelected = []
  airPurifierPriceSelected = []

  //airConditioner filter selected option array
  airConditionerSubCategorySelected = []
  airConditionerCapacitySelected = []
  airConditionerSeriesSelected = []
  airConditionerStarRatingSelected = []
  airConditionerPriseSelected = []

  //waterPurifie filter selected option array
  waterPurifierTechnologySelected = []
  waterPurifierModelNameSelected = []
  waterPurifierCapacitySelected = []
  waterPurifierPriseSelected = []

  //airCooler filter selected option array
  airCoolerTypeSelected = []
  airCoolerPriceSelected = []
  airCoolerCapacitySelected = []

  //deep freezer filter selected option array
  deepFreezerCategorySelected = []
  deepFreezerCapacitySelected = []
  deepFreezerDoorsSelected = []
  deepFreezerRefrigerantSelected = []

  //Bottled Water Dispenser filter selected option array
  waterDispenserSeriesSelected = []
  waterDispenserColourSelected = []
  waterDispenserFaucetsSelected = []

  //Visi Cooler filter selected option array
  visiCoolerSeriesSelected = []
  visiCoolerCapacitySelected = []
  visiCoolerDoorsSelected = []
  visiCoolerCoolingTypeSelected = []

  databaseObj: SQLiteObject;
  readonly database_name: string = "bluestar_dealer.db";
  readonly table_air_conditioner: string = "air_conditioner";
  readonly table_air_cooler: string = "air_cooler";
  readonly table_air_purifier: string = "air_purifier";
  readonly table_water_purifier: string = "water_purifier";
  readonly table_deep_freezer: string = "deep_freezer";
  readonly table_bottled_water_dispenser: string = "bottled_water_dispenser";
  readonly table_visi_cooler: string = "visi_cooler";

  emptyListFlage = true;
  defolutImageFlage = false;

  airConditionerFlage = false;
  airCoolerFlage = false;
  airPurifierFlage = false;
  waterPurifierFlage = false;
  deepFreezerFlage = false; 
  bottleWaterDispenserFlage = false; 
  visiCoolerFlage = false; 

  currentTab = "All";
  filterApply = false;

  flagShowFilter = false;

  //Compare 

  compareFlage = false;
  // addedFlage = false;
  compareCount = 0;
  compareList = [];
  compareProductId: any;
  btnCompareText = 'Compare';

  productDetails = [];
  uspList = [];
  images = [];
  item = {
    title: "",
    ID: "",
    Image: "",
    ProductTitle: "",
    SKUCode: "",
    MRP: "",
    productSpecifications: [],
    uspList: []
  };

  showBottomPopup: boolean = false;
  popupCompareList = [];
  noRecords: number;
  notification_listing = [];
  countNotification: any;
  openCompareFunction = false;
  refreshId: any;

  favouritesFlage = false;
  productName = '';
  MRP = "";
  SKUCode = "";
  reasonsToBuyFlage = false;
  reasonsToBuyImageArray = [];
  brochures: any;

  compare_product_listing = [];
  showComparePopup: boolean = false;
  noRecords2: number;
  selectedIDs = [];
  flagSameCategory: boolean = false;

  songsList:any;


  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,
    public loadingController: LoadingController, public modalCtrl: ModalController,
    private platform: Platform, private popoverCtrl: PopoverController,
    private sqlite: SQLite, private downloader: Downloader,
    private storage: Storage, private toastCtrl: ToastController,
    private socialSharing: SocialSharing,
    private firebaseAnalytics: FirebaseAnalytics,
    private inAppBrowser: InAppBrowser,
    private myapp: AppComponent, public alertController: AlertController,
    public categoriesPage: CategoriesPage) {

    this.route.queryParams.subscribe(params => {
      console.log("params", params);
      this.openCompareFunction = params.openCompareFunction;
      if (params && params.title) {
        this.title = params.title
        if (this.filterApply == false) {
          this.clearFilter();
          this.clickOnCategary(this.title)

          this.compareFlage = false;
          this.compareCount = 0;
          this.showBottomPopup = false;
          this.showComparePopup = false;
        }

        if (this.openCompareFunction) {
          this.compareFlage = true;
          this.compareCount = 0;
          this.showBottomPopup = true;

          this.storage.get('compareList').then((val) => {
            if (val) {
              this.popupCompareList = val;
            }
            //console.log("this.popupCompareList", this.popupCompareList);
          });
        }
      }
    });

  }

  ionViewWillEnter() {
    console.log("Enter ionViewWillEnter");
    // this.getComapreProductList();
    this.compareFlage = false;
    this.compareCount = 0;
    this.showBottomPopup = false;
    this.showComparePopup = false;

    if (this.openCompareFunction) {
      this.compareFlage = true;
      this.compareCount = 0;
      this.showBottomPopup = true;

      this.storage.get('compareList').then((val) => {
        this.popupCompareList = val;
        console.log("this.popupCompareList", this.popupCompareList);
      });
    }

    this.clearFilter();
    this.clickOnCategary(this.title);
    this.getCountNotification();
    // this.refreshId = setInterval(() => {
    //   this.getCountNotification();
    // }, 2000);
  }

  // ionViewDidLeave() {
  //   //Stop refresh
  //   clearInterval(this.refreshId);
  // }

  getCountNotification() {
    // this.loadingController.create({
    //   message: 'Please wait',
    // }).then((res) => {
    //   res.present();
    if (navigator.onLine) {
      this.http.get(this.categoriesPage.apiBaseUrl + '/bluestar_api/notification_list').subscribe((response) => {
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
                  console.log("countNotification****", this.countNotification);
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
    //   console.log("countNotification****", this.countNotification);
    // })
  }

  removeNotification() {
    // console.log("Eneter removeNotification");
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

  formatNumber(item) {
    var number = item.MRP ? item.MRP : item.Price;
    return new Intl.NumberFormat('en-IN').format(number);
  }

  loadData(event) {
    if (this.product_listing.length < this.data.length) {
      setTimeout(() => {
        event.target.complete();
        let len = this.product_listing.length;
        for (let i = len; i < this.data.length; i++) {
          if (i < this.page * this.pagenationProductCount) {
            this.product_listing.push(this.data[i]);
          }
        }
        this.ckeckFavourateProduct();
        this.checkCompareData();
        this.page++;
        //event.target.disabled = true;
      }, 500);
    } else {
      event.target.complete();
    }

  }

  goToProductListPage(text) {
    this.filterApply = false;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        title: text
      }
    };
    this.router.navigate(['product'], navigationExtras);
  }

  getProductData(title) {
    let param = {};
    if (title == "Air Conditioners") {
      param = { air_conditioner: "Air Conditioners" }
    } else if (title == "Air Coolers") {
      param = { air_cooler: "Air Coolers" }
    } else if (title == "Air Purifiers") {
      param = { air_purifier: "Air Purifiers" }
    } else if (title == "Water Purifiers") {
      param = { water_purifier: "Water Purifiers" }
    } else if (title == "Deep Freezer") {
      param = { deep_freezer: "Deep Freezer" }
    } else if (title == "Bottled Water Dispenser") {
      param = { water_dispenser: "Bottled Water Dispenser" }
    }  else if (title == "Visi Cooler") {
      param = { visi_cooler: "Visi Cooler" }
    }     

    if (this.platform.is('cordova')) {
      this.firebaseAnalytics.logEvent('product_category_view', { category: this.title })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    }

    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_listing', param).subscribe((response) => {
          Object.keys(response).map(key => {
            this.product_listing = []
            this.data = response[key].product_listing;
            this.page = 1;
            this.content.scrollToTop(0);
            for (let i = 0; i < this.data.length; i++) {
              if (i < this.page * this.pagenationProductCount) {
                this.product_listing.push(this.data[i]);
              }
            }
            // console.log("product_listing", this.product_listing);
            this.page = 2;
            //this.product_listing = response[key].product_listing;
            this.total_product = response[key].product_listing.length;
            // console.log("total_product", this.total_product);
            this.all_product_listing = response[key].product_listing;
            // this.product_listing.sort(function (a, b) {   // finally sort what remains
            //   if (Number(a.MRP) < Number(b.MRP)) {
            //     return -1;
            //   }
            //   else if (Number(a.MRP) > Number(b.MRP)) {
            //     return 1;
            //   }
            //   else {
            //     return 0;
            //   }
            // });

            this.checkEmptyProductList()
            this.ckeckFavourateProduct();
            this.checkCompareData();
            this.defolutImageFlage = false;
            this.flagShowFilter = false;
            res.dismiss();
          })
        }, err => {
          console.log("err.........", JSON.stringify(err))
          this.getDataFromSqlit(title)
          res.dismiss();
        });
      } else {
        this.getDataFromSqlit(title)
        res.dismiss();
        console.log("no internat connection")
      }
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProductData(this.title);
      //this.myapp.refreseProductData();
      this.clearFilter();
      event.target.complete();

    }, 2000);
  }

  clearFilter() {
    this.flagShowFilter = false;

    this.airPurifierCoverageAreaSelected = []
    this.airPurifierCADRSelected = []
    this.airPurifierPriceSelected = []

    this.airConditionerSubCategorySelected = []
    this.airConditionerCapacitySelected = []
    this.airConditionerSeriesSelected = []
    this.airConditionerStarRatingSelected = []
    this.airConditionerPriseSelected = []

    this.waterPurifierTechnologySelected = []
    this.waterPurifierModelNameSelected = []
    this.waterPurifierCapacitySelected = []
    this.waterPurifierPriseSelected = []

    this.airCoolerTypeSelected = []
    this.airCoolerPriceSelected = []
    this.airCoolerCapacitySelected = []

    this.deepFreezerCategorySelected = []
    this.deepFreezerCapacitySelected = []
    this.deepFreezerDoorsSelected = []
    this.deepFreezerRefrigerantSelected = []

    this.waterDispenserSeriesSelected = []
    this.waterDispenserColourSelected = []
    this.waterDispenserFaucetsSelected = []

    this.visiCoolerSeriesSelected = []
    this.visiCoolerCapacitySelected = []
    this.visiCoolerDoorsSelected = []
    this.visiCoolerCoolingTypeSelected = []

  }

  getDataFromSqlit(title) {
    this.defolutImageFlage = true;
    if (title == "Air Conditioners") {
      this.getAirConditionerDataFromSqlite()
    } else if (title == "Air Coolers") {
      this.getAirCoolerDataFromSqlite()
    } else if (title == "Air Purifiers") {
      this.getAirPurifierDataFromSqlite()
    } else if (title == "Water Purifiers") {
      this.getWaterPurifierDataFromSqlite()
    } else if (title == "Deep Freezer") {
      this.getDeepFreezerDataFromSqlite()
    } else if (title == "Bottled Water Dispenser") {
      this.getBottledWaterDispenserDataFromSqlite()
    } else if (title == "Visi Cooler") {
      this.getVisiCoolerDataFromSqlite()
    }
  } 

  // Filter function Start
  getAirConditionerFilterData(url, priceArray) {
    if (priceArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
      SELECT * FROM ${this.table_air_conditioner} ${url} ORDER BY Price
      `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                SubCategory: "",
                ProductTitle: "",
                Price: "",
                Capacity: "",
                ID: "",
                Image: "",
                Series: "",
                StarRating: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in priceArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_air_conditioner} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_air_conditioner} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_air_conditioner} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_air_conditioner} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                SubCategory: "",
                ProductTitle: "",
                Price: "",
                Capacity: "",
                ID: "",
                Image: "",
                Series: "",
                StarRating: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }

  getWaterPurifierFilterData(url, priceArray) {
    if (priceArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
      SELECT * FROM ${this.table_water_purifier} ${url} ORDER BY Price
      `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in priceArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_water_purifier} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_water_purifier} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_water_purifier} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_water_purifier} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }

  getAirCoolerFilterData(url, categaryArray) {
    if (categaryArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_air_cooler} ${url} ORDER BY Price
    `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Type: "",
                ID: "",
                Image: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in categaryArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_air_cooler} ` + url + "Price BETWEEN " + categaryArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_air_cooler} ` + url + "AND Price BETWEEN " + categaryArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_air_cooler} ` + url + "Price BETWEEN " + categaryArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_air_cooler} ` + url + "AND Price BETWEEN " + categaryArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = []
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Type: "",
                ID: "",
                Image: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }

  getAirPurifierFilterData(url, priceArray) {
    if (priceArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
      SELECT * FROM ${this.table_air_purifier} ${url} ORDER BY Price
      `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                CADR: "",
                ProductTitle: "",
                Price: "",
                CoverageArea: "",
                ID: "",
                Image: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in priceArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_air_purifier} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_air_purifier} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_air_purifier} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_air_purifier} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                CADR: "",
                ProductTitle: "",
                Price: "",
                CoverageArea: "",
                ID: "",
                Image: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }


  getDeepFreezerFilterData(url, priceArray) {
    if (priceArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
      SELECT * FROM ${this.table_deep_freezer} ${url} ORDER BY Price
      `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              console.log("my deep length",res.rows.length)
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: "",
                Doors: "",
                Refrigerant: "",
                Category: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object);
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("Deep Freezer error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in priceArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_deep_freezer} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_deep_freezer} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_deep_freezer} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_deep_freezer} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: "",
                Doors: "",
                Refrigerant: "",
                Category: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }


  getBottledWaterDispenserFilterData(url, priceArray) {
    if (priceArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
      SELECT * FROM ${this.table_bottled_water_dispenser} ${url} ORDER BY Price
      `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: "",
                Series: "",
                Doors: "",
                Refrigerant: "",
                CoolingType: "",
                Colour:"",
                Faucets: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in priceArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_bottled_water_dispenser} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_bottled_water_dispenser} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_bottled_water_dispenser} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_bottled_water_dispenser} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: "",
                Series: "",
                Doors: "",
                Refrigerant: "",
                CoolingType: "",
                Colour:"",
                Faucets: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }


  getVisiCoolerFilterData(url, priceArray) {
    if (priceArray.length == 0) {
      this.myapp.databaseObj.executeSql(`
      SELECT * FROM ${this.table_visi_cooler} ${url} ORDER BY Price
      `
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: "",
                Series: "",
                Doors: "",
                Refrigerant: "",
                CoolingType: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    } else {
      let queryUrl = ""
      for (let i in priceArray) {
        if (i == '0') {
          if (url == "WHERE ") {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_visi_cooler} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + `SELECT * FROM ${this.table_visi_cooler} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        } else {
          if (url == "WHERE ") {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_visi_cooler} ` + url + "Price BETWEEN " + priceArray[i] + " "
          } else {
            queryUrl = queryUrl + "UNION " + `SELECT * FROM ${this.table_visi_cooler} ` + url + "AND Price BETWEEN " + priceArray[i] + " "
          }
        }
      }
      this.myapp.databaseObj.executeSql(`${queryUrl} ORDER BY Price`
        , [])
        .then((res) => {
          if (res.rows.length > 0) {
            this.product_listing = [];
            for (var i = 0; i < res.rows.length; i++) {
              let rowKeys = []
              let singleRowData = []
              var object = {
                SKUCode: "",
                JsonData: "",
                Capacity: "",
                ProductTitle: "",
                Price: "",
                Technology: "",
                ID: "",
                Image: "",
                ModelName: "",
                Series: "",
                Doors: "",
                Refrigerant: "",
                CoolingType: ""
              };
              rowKeys = Object.keys(res.rows.item(i))
              Object.keys(res.rows.item(i)).map(key => {
                singleRowData.push(res.rows.item(i)[key])
              })
              for (let index in rowKeys) {
                object[rowKeys[index]] = singleRowData[index]
              }
              this.product_listing.push(object)
            }
            this.ckeckFavourateProduct2();
          } else {
            this.product_listing = [];
          }
          this.checkEmptyProductList();
        })
        .catch(e => {
          console.log("error " + JSON.stringify(e))
        });
    }
  }

  // Filter function End



  // sqlite function start
  getAirPurifierDataFromSqlite() {
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_air_purifier} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              CADR: "",
              ProductTitle: "",
              Price: "",
              CoverageArea: "",
              ID: "",
              Image: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  getAirConditionerDataFromSqlite() {
    //ID, ProductTitle, SKUCode, Image, SubCategory, JsonData, Capacity, Series, StarRating, Price
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_air_conditioner} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              SubCategory: "",
              ProductTitle: "",
              Price: "",
              Capacity: "",
              ID: "",
              Image: "",
              Series: "",
              StarRating: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  getAirCoolerDataFromSqlite() {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Type, Price)
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_air_cooler} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              Capacity: "",
              ProductTitle: "",
              Price: "",
              Type: "",
              ID: "",
              Image: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  getWaterPurifierDataFromSqlite() {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_water_purifier} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              Capacity: "",
              ProductTitle: "",
              Price: "",
              Technology: "",
              ID: "",
              Image: "",
              ModelName: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  } 

  getDeepFreezerDataFromSqlite() {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_deep_freezer} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              Capacity: "",
              ProductTitle: "",
              Price: "",
              Technology: "",
              ID: "",
              Image: "",
              ModelName: "",
              Doors: "",
              Refrigerant: "",
              Category: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }


  getBottledWaterDispenserDataFromSqlite() {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_bottled_water_dispenser} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              Capacity: "",
              ProductTitle: "",
              Price: "",
              Technology: "",
              ID: "",
              Image: "",
              ModelName: "",
              Refrigerant: "",
              CoolingType: "",
              Colour:"",
              Faucets: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  getVisiCoolerDataFromSqlite() {
    //(ID, ProductTitle, SKUCode, Image, JsonData, Capacity, Technology, Price, ModelName)
    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${this.table_visi_cooler} ORDER BY Price
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          this.product_listing = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              SKUCode: "",
              JsonData: "",
              Capacity: "",
              ProductTitle: "",
              Price: "",
              Technology: "",
              ID: "",
              Image: "",
              ModelName: "",
              Doors: "",
              Refrigerant: "",
              CoolingType: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              object[rowKeys[index]] = singleRowData[index]
            }
            this.product_listing.push(object)
          }
          this.sqlitePagenation()
          this.ckeckFavourateProduct();
          this.checkEmptyProductList();
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  // sqlite function end

  sqlitePagenation() {
    this.all_product_listing = this.product_listing
    this.total_product = this.product_listing.length;
    this.data = this.product_listing
    this.product_listing = []
    this.page = 1;
    this.content.scrollToTop(0);
    for (let i = 0; i < this.data.length; i++) {
      if (i < this.page * this.pagenationProductCount) {
        this.product_listing.push(this.data[i]);
      }
    }
    this.page = 2;
  }

  ckeckFavourateProduct() {
    let data = []
    this.storage.get('favouriteList').then((val) => {
      if (val != null) {
        data = val;
        let count = 0
        for (let index in this.product_listing) {
          for (let item in data) {
            if (this.product_listing[index].ID == data[item].ID) {
              count = 1;
            }
          }
          if (count == 0) {
            this.product_listing[index].favouritesFlage = false
          } else {
            this.product_listing[index].favouritesFlage = true
          }
          count = 0
        }
      } else {
        for (let index in this.product_listing) {
          this.product_listing[index].favouritesFlage = false
        }
      }
    })
  }

  ckeckFavourateProduct2() {
    this.data = this.product_listing;
    this.total_product = this.product_listing.length;
    this.page = 1;
    this.content.scrollToTop(0);
    this.product_listing = [];
    for (let i = 0; i < this.data.length; i++) {
      if (i < this.page * this.pagenationProductCount) {
        this.product_listing.push(this.data[i]);
      }
    }
    this.page = 2;
    let data = []
    this.storage.get('favouriteList').then((val) => {
      if (val != null) {
        data = val;
        let count = 0
        for (let index in this.product_listing) {
          for (let item in data) {
            if (this.product_listing[index].ID == data[item].ID) {
              count = 1;
            }
          }
          if (count == 0) {
            this.product_listing[index].favouritesFlage = false
          } else {
            this.product_listing[index].favouritesFlage = true
          }
          count = 0
        }
      } else {
        for (let index in this.product_listing) {
          this.product_listing[index].favouritesFlage = false
        }
      }
    })
  }

  loadingFilter() {
    this.loadingController.create({
      message: 'This Loader Will Auto Hide in 2 Seconds',
      duration: 1000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds', dis);
      });
    });
  }

  openFilterModal() {
    this.showComparePopup = false;
    this.loadingController.create({
      message: 'Please wait',
      duration: 1000
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        this.openModal();
      });
    });
  }


  // All Filter Logic
  async openModal() {
    console.log("Enter openModal");

    if (this.title == "Air Conditioners") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          airConditionerSubCategorySelected: this.airConditionerSubCategorySelected,
          airConditionerCapacitySelected: this.airConditionerCapacitySelected,
          airConditionerSeriesSelected: this.airConditionerSeriesSelected,
          airConditionerStarRatingSelected: this.airConditionerStarRatingSelected,
          airConditionerPriseSelected: this.airConditionerPriseSelected
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {
          let feilterData = data['data']; // Here's your selected user!
          this.filterApply = true;
          if (feilterData.close == "false") {
            let query = "WHERE ";
            this.airConditionerSubCategorySelected = feilterData.airConditionerSubCategorySelected;
            this.airConditionerCapacitySelected = feilterData.airConditionerCapacitySelected;
            this.airConditionerSeriesSelected = feilterData.airConditionerSeriesSelected;
            this.airConditionerStarRatingSelected = feilterData.airConditionerStarRatingSelected;
            this.airConditionerPriseSelected = feilterData.airConditionerPriseSelected;

            // start flagShowFilter
            if (this.airConditionerSubCategorySelected.length != 0 || this.airConditionerCapacitySelected.length != 0 || this.airConditionerSeriesSelected.length != 0 || this.airConditionerStarRatingSelected.length != 0 || this.airConditionerPriseSelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }


            for (let i in this.airConditionerSubCategorySelected) {
              this.firebaseAnalytics.logEvent('air_conditioner_filter', { sub_category: this.airConditionerSubCategorySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airConditionerCapacitySelected) {
              this.firebaseAnalytics.logEvent('air_conditioner_filter', { capacity: this.airConditionerCapacitySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airConditionerSeriesSelected) {
              this.firebaseAnalytics.logEvent('air_conditioner_filter', { series: this.airConditionerSeriesSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airConditionerStarRatingSelected) {
              this.firebaseAnalytics.logEvent('air_conditioner_filter', { star_rating: this.airConditionerStarRatingSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airConditionerPriseSelected) {
              console.log("this.airConditionerPriseSelected[i]", this.airConditionerPriseSelected[i])
              this.firebaseAnalytics.logEvent('air_conditioner_filter', { MRP: this.airConditionerPriseSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            let filterCount = 0;
            if (feilterData.SubCategory != "") {
              if (filterCount > 0) {
                query = query + "AND " + "SubCategory IN " + "(" + feilterData.SubCategory + ") "
                filterCount++;
              } else {
                query = query + "SubCategory IN " + "(" + feilterData.SubCategory + ") "
                filterCount++;
              }
            }

            if (feilterData.Capacity != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Capacity IN " + "(" + feilterData.Capacity + ") "
                filterCount++;
              } else {
                query = query + "Capacity IN " + "(" + feilterData.Capacity + ") "
                filterCount++;
              }
            }

            if (feilterData.Series != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Series IN " + "(" + feilterData.Series + ") "
                filterCount++;
              } else {
                query = query + "Series IN " + "(" + feilterData.Series + ") "
                filterCount++;
              }
            }

            if (feilterData.StarRating != "") {
              if (filterCount > 0) {
                query = query + "AND " + "StarRating IN " + "(" + feilterData.StarRating + ") "
                filterCount++;
              } else {
                query = query + "StarRating IN " + "(" + feilterData.StarRating + ") "
                filterCount++;
              }
            }
            let PriceValue = []
            if (this.airConditionerPriseSelected.length != 0) {
              for (let i in this.airConditionerPriseSelected) {
                PriceValue.push(this.airConditionerPriseSelected[i].replace("-", " AND "))
              }
            }

            if (query != "WHERE " || PriceValue.length != 0) {
              this.getAirConditionerFilterData(query, PriceValue);
            } else {
              console.log("Enter openModal onDidDismiss 3");
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }
          } else {
            this.airConditionerSubCategorySelected = feilterData.airConditionerSubCategorySelected;
            this.airConditionerCapacitySelected = feilterData.airConditionerCapacitySelected;
            this.airConditionerSeriesSelected = feilterData.airConditionerSeriesSelected;
            this.airConditionerStarRatingSelected = feilterData.airConditionerStarRatingSelected;
            this.airConditionerPriseSelected = feilterData.airConditionerPriseSelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } else if (this.title == "Air Coolers") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          airCoolerTypeSelected: this.airCoolerTypeSelected,
          airCoolerPriceSelected: this.airCoolerPriceSelected,
          airCoolerCapacitySelected: this.airCoolerCapacitySelected
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {

          this.filterApply = true;
          let feilterData = data['data']; // Here's your selected user!
          if (feilterData.close == "false") {
            let query = "WHERE ";
            this.airCoolerTypeSelected = feilterData.airCoolerTypeSelected;
            this.airCoolerPriceSelected = feilterData.airCoolerPriceSelected;
            this.airCoolerCapacitySelected = feilterData.airCoolerCapacitySelected;

            // start flagShowFilter
            if (this.airCoolerTypeSelected.length != 0 || this.airCoolerPriceSelected.length != 0 || this.airCoolerCapacitySelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }
            // end flagShowFilter

            console.log("Type", this.airCoolerTypeSelected);
            console.log("Price", this.airCoolerPriceSelected);
            console.log("Capacity", this.airCoolerCapacitySelected);
            for (let i in this.airCoolerTypeSelected) {
              this.firebaseAnalytics.logEvent('air_cooler_filter', { type: this.airCoolerTypeSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airCoolerPriceSelected) {
              this.firebaseAnalytics.logEvent('air_cooler_filter', { MRP: this.airCoolerPriceSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airCoolerCapacitySelected) {
              this.firebaseAnalytics.logEvent('air_cooler_filter', { capacity: this.airCoolerCapacitySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            let filterCount = 0;
            //Capacity BETWEEN 25 AND 50
            if (feilterData.Type != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Type IN " + "(" + feilterData.Type + ") "
                filterCount++;
              } else {
                query = query + "Type IN " + "(" + feilterData.Type + ") "
                filterCount++;
              }
            }
            let CapacityValue = []
            let Capacity = ""
            if (this.airCoolerCapacitySelected.length != 0) {
              for (let i in this.airCoolerCapacitySelected) {
                let firstValue = this.airCoolerCapacitySelected[i].split('-')[0]
                let secondValue = this.airCoolerCapacitySelected[i].split('-')[1]
                var size = Number(secondValue) - Number(firstValue)
                for (let i = 0; i < size; i++) {
                  CapacityValue.push(Number(firstValue) + i)
                }
              }
              for (let item in CapacityValue) {
                if (Capacity.length == 0) {
                  Capacity = Capacity + CapacityValue[item]
                } else {
                  Capacity = Capacity + ',' + CapacityValue[item]
                }
              }
            }
            if (Capacity != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Capacity IN " + "(" + Capacity + ") "
                filterCount++;
              } else {
                query = query + "Capacity IN " + "(" + Capacity + ") "
                filterCount++;
              }
            }
            let PriceValue = []
            if (this.airCoolerPriceSelected.length != 0) {
              for (let i in this.airCoolerPriceSelected) {
                PriceValue.push(this.airCoolerPriceSelected[i].replace("-", " AND "))
              }
            }
            if (query != "WHERE " || PriceValue.length != 0) {
              this.getAirCoolerFilterData(query, PriceValue);
            } else {
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }
          } else {
            this.airCoolerTypeSelected = feilterData.airCoolerTypeSelected;
            this.airCoolerPriceSelected = feilterData.airCoolerPriceSelected;
            this.airCoolerCapacitySelected = feilterData.airCoolerCapacitySelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } else if (this.title == "Air Purifiers") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          airPurifierCoverageAreaSelected: this.airPurifierCoverageAreaSelected,
          airPurifierCADRSelected: this.airPurifierCADRSelected,
          airPurifierPriceSelected: this.airPurifierPriceSelected
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {
          this.filterApply = true;
          let feilterData = data['data']; // Here's your selected user!
          if (feilterData.close == "false") {
            let query = "WHERE ";
            this.airPurifierCoverageAreaSelected = feilterData.airPurifierCoverageAreaSelected;
            this.airPurifierCADRSelected = feilterData.airPurifierCADRSelected;
            this.airPurifierPriceSelected = feilterData.airPurifierPriceSelected

            // start flagShowFilter
            if (this.airPurifierCoverageAreaSelected.length != 0 || this.airPurifierCADRSelected.length != 0 || this.airPurifierPriceSelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }
            // end flagShowFilter

            for (let i in this.airPurifierPriceSelected) {
              this.firebaseAnalytics.logEvent('air_purifier_filter', { MRP: this.airPurifierPriceSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airPurifierCoverageAreaSelected) {
              this.firebaseAnalytics.logEvent('air_purifier_filter', { coverage_area: this.airPurifierCoverageAreaSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.airPurifierCADRSelected) {
              this.firebaseAnalytics.logEvent('air_purifier_filter', { CADR: this.airPurifierCADRSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            let filterCount = 0;
            if (feilterData.CADR != "") {
              filterCount++;
              query = query + "CADR IN " + "(" + feilterData.CADR + ") "
            }

            if (feilterData.CoverageArea != "") {
              if (filterCount > 0) {
                query = query + "AND " + "CoverageArea IN " + "(" + feilterData.CoverageArea + ") "
                filterCount++;
              } else {
                query = query + "CoverageArea IN " + "(" + feilterData.CoverageArea + ") "
                filterCount++;
              }
            }
            let PriceValue = []
            if (this.airPurifierPriceSelected.length != 0) {
              for (let i in this.airPurifierPriceSelected) {
                PriceValue.push(this.airPurifierPriceSelected[i].replace("-", " AND "))
              }
            }

            if (query != "WHERE " || PriceValue.length != 0) {
              this.getAirPurifierFilterData(query, PriceValue);
            } else {
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }
          } else {
            this.airPurifierCoverageAreaSelected = feilterData.airPurifierCoverageAreaSelected;
            this.airPurifierCADRSelected = feilterData.airPurifierCADRSelected;
            this.airPurifierPriceSelected = feilterData.airPurifierPriceSelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } else if (this.title == "Water Purifiers") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          waterPurifierTechnologySelected: this.waterPurifierTechnologySelected,
          waterPurifierModelNameSelected: this.waterPurifierModelNameSelected,
          waterPurifierCapacitySelected: this.waterPurifierCapacitySelected,
          waterPurifierPriseSelected: this.waterPurifierPriseSelected
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {
          this.filterApply = true;
          let feilterData = data['data']; // Here's your selected user!
          if (feilterData.close == "false") {
            let query = "WHERE ";
            this.waterPurifierTechnologySelected = feilterData.waterPurifierTechnologySelected,
              this.waterPurifierModelNameSelected = feilterData.waterPurifierModelNameSelected,
              this.waterPurifierCapacitySelected = feilterData.waterPurifierCapacitySelected,
              this.waterPurifierPriseSelected = feilterData.waterPurifierPriseSelected

            // start flagShowFilter
            if (this.waterPurifierTechnologySelected.length != 0 || this.waterPurifierModelNameSelected.length != 0 || this.waterPurifierCapacitySelected.length != 0 || this.waterPurifierPriseSelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }
            // end flagShowFilter

            for (let i in this.waterPurifierTechnologySelected) {
              this.firebaseAnalytics.logEvent('water_purifier_filter', { technology: this.waterPurifierTechnologySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.waterPurifierPriseSelected) {
              this.firebaseAnalytics.logEvent('water_purifier_filter', { MRP: this.waterPurifierPriseSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.waterPurifierCapacitySelected) {
              this.firebaseAnalytics.logEvent('water_purifier_filter', { capacity: this.waterPurifierCapacitySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.waterPurifierModelNameSelected) {
              this.firebaseAnalytics.logEvent('water_purifier_filter', { model_name: this.waterPurifierModelNameSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            let filterCount = 0;

            if (feilterData.Technology != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Technology IN " + "(" + feilterData.Technology + ") "
                filterCount++;
              } else {
                query = query + "Technology IN " + "(" + feilterData.Technology + ") "
                filterCount++;
              }
            }

            if (feilterData.ModelName != "") {
              if (filterCount > 0) {
                query = query + "AND " + "ModelName IN " + "(" + feilterData.ModelName + ") "
                filterCount++;
              } else {
                query = query + "ModelName IN " + "(" + feilterData.ModelName + ") "
                filterCount++;
              }
            }

            if (feilterData.Capacity != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Capacity IN " + "(" + feilterData.Capacity + ") "
                filterCount++;
              } else {
                query = query + "Capacity IN " + "(" + feilterData.Capacity + ") "
                filterCount++;
              }
            }

            let PriceValue = []
            if (this.waterPurifierPriseSelected.length != 0) {
              for (let i in this.waterPurifierPriseSelected) {
                PriceValue.push(this.waterPurifierPriseSelected[i].replace("-", " AND "))
              }
            }
            if (query != "WHERE " || PriceValue.length != 0) {
              this.getWaterPurifierFilterData(query, PriceValue);
            } else {
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }
          } else {
            this.waterPurifierTechnologySelected = feilterData.waterPurifierTechnologySelected;
            this.waterPurifierModelNameSelected = feilterData.waterPurifierModelNameSelected;
            this.waterPurifierCapacitySelected = feilterData.waterPurifierCapacitySelected;
            this.waterPurifierPriseSelected = feilterData.waterPurifierPriseSelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } else if (this.title == "Deep Freezer") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          deepFreezerCategorySelected: this.deepFreezerCategorySelected,
          deepFreezerCapacitySelected: this.deepFreezerCapacitySelected,
          deepFreezerDoorsSelected: this.deepFreezerDoorsSelected,
          deepFreezerRefrigerantSelected: this.deepFreezerRefrigerantSelected
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {
          this.filterApply = true;
          let feilterData = data['data']; // Here's your selected user!
          if (feilterData.close == "false") {
            let query = "WHERE ";
            this.deepFreezerCategorySelected = feilterData.deepFreezerCategorySelected;
            this.deepFreezerCapacitySelected = feilterData.deepFreezerCapacitySelected;
            this.deepFreezerDoorsSelected = feilterData.deepFreezerDoorsSelected;
            this.deepFreezerRefrigerantSelected = feilterData.deepFreezerRefrigerantSelected

            // start flagShowFilter
            if (this.deepFreezerCategorySelected.length != 0 || this.deepFreezerCapacitySelected.length != 0 || this.deepFreezerDoorsSelected.length != 0 || this.deepFreezerRefrigerantSelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }
            // end flagShowFilter

            for (let i in this.deepFreezerCategorySelected) {
              this.firebaseAnalytics.logEvent('deep_freezer_filter', { categary: this.deepFreezerCategorySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.deepFreezerCapacitySelected) {
              this.firebaseAnalytics.logEvent('deep_freezer_filter', { capacity: this.deepFreezerCapacitySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.deepFreezerDoorsSelected) {
              this.firebaseAnalytics.logEvent('deep_freezer_filter', { doors: this.deepFreezerDoorsSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.deepFreezerRefrigerantSelected) {
              this.firebaseAnalytics.logEvent('deep_freezer_filter', { refrigerant: this.deepFreezerRefrigerantSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }


            let filterCount = 0;

            if (feilterData.Category != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Category IN " + "(" + feilterData.Category + ") "
                filterCount++;
              } else {
                query = query + "Category IN " + "(" + feilterData.Category + ") "
                filterCount++;
              }
            }


            let CapacityValue = []
            let Capacity = ""
            if (this.deepFreezerCapacitySelected.length != 0) {
              for (let i in this.deepFreezerCapacitySelected) {
                let firstValue = this.deepFreezerCapacitySelected[i].split('-')[0]
                let secondValue = this.deepFreezerCapacitySelected[i].split('-')[1]
                var size = Number(secondValue) - Number(firstValue)
                for (let i = 0; i < size; i++) {
                  CapacityValue.push(Number(firstValue) + i)
                }
              }
              for (let item in CapacityValue) {
                if (Capacity.length == 0) {
                  Capacity = Capacity + CapacityValue[item]
                } else {
                  Capacity = Capacity + ',' + CapacityValue[item]
                }
              }
            }


            if (Capacity != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Capacity IN " + "(" + Capacity + ") "
                filterCount++;
              } else {
                query = query + "Capacity IN " + "(" + Capacity + ") "
                filterCount++;
              }
            }

            if (feilterData.Doors != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Doors IN " + "(" + feilterData.Doors + ") "
                filterCount++;
              } else {
                query = query + "Doors IN " + "(" + feilterData.Doors + ") "
                filterCount++;
              }
            }

            if (feilterData.Refrigerant != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Refrigerant IN " + "(" + feilterData.Refrigerant + ") "
                filterCount++;
              } else {
                query = query + "Refrigerant IN " + "(" + feilterData.Refrigerant + ") "
                filterCount++;
              }
            }

      

           
            let PriceValue = []
            // if (this.airPurifierPriceSelected.length != 0) {
            //   for (let i in this.airPurifierPriceSelected) {
            //     PriceValue.push(this.airPurifierPriceSelected[i].replace("-", " AND "))
            //   }
            // }

            if (query != "WHERE " || PriceValue.length != 0) {
              this.getDeepFreezerFilterData(query, PriceValue);
            } else {
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }

          } else {
            this.deepFreezerCategorySelected = feilterData.deepFreezerCategorySelected;
            this.deepFreezerCapacitySelected = feilterData.deepFreezerCapacitySelected;
            this.deepFreezerDoorsSelected = feilterData.deepFreezerDoorsSelected;
            this.deepFreezerRefrigerantSelected = feilterData.deepFreezerRefrigerantSelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } else if (this.title == "Bottled Water Dispenser") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          waterDispenserSeriesSelected: this.waterDispenserSeriesSelected,
          waterDispenserColourSelected: this.waterDispenserColourSelected,
          waterDispenserFaucetsSelected: this.waterDispenserFaucetsSelected,
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {
          this.filterApply = true;
          let feilterData = data['data']; // Here's your selected user!
          if (feilterData.close == "false") {
            let query = "WHERE ";
              this.waterDispenserSeriesSelected = feilterData.waterDispenserSeriesSelected,
              this.waterDispenserColourSelected = feilterData.waterDispenserColourSelected,
              this.waterDispenserFaucetsSelected = feilterData.waterDispenserFaucetsSelected

            // start flagShowFilter
            if (this.waterDispenserSeriesSelected.length != 0 || this.waterDispenserColourSelected.length != 0 || this.waterDispenserFaucetsSelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }
            // end flagShowFilter

            for (let i in this.waterDispenserSeriesSelected) {
              this.firebaseAnalytics.logEvent('water_dispenser_filter', { series: this.waterDispenserSeriesSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.waterDispenserColourSelected) {
              this.firebaseAnalytics.logEvent('water_dispenser_filter', { capacity: this.waterDispenserColourSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.waterDispenserFaucetsSelected) {
              this.firebaseAnalytics.logEvent('water_dispenser_filter', { doors: this.waterDispenserFaucetsSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            
            let filterCount = 0;

            if (feilterData.Series != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Series IN " + "(" + feilterData.Series + ") "
                filterCount++;
              } else {
                query = query + "Series IN " + "(" + feilterData.Series + ") "
                filterCount++;
              }
            }

            if (feilterData.Colour != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Colour IN " + "(" + feilterData.Colour + ") "
                filterCount++;
              } else {
                query = query + "Colour IN " + "(" + feilterData.Colour + ") "
                filterCount++;
              }
            }

            if (feilterData.Faucets != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Faucets IN " + "(" + feilterData.Faucets + ") "
                filterCount++;
              } else {
                query = query + "Faucets IN " + "(" + feilterData.Faucets + ") "
                filterCount++;
              }
            }

            let PriceValue = []
            // if (this.waterPurifierPriseSelected.length != 0) {
            //   for (let i in this.waterPurifierPriseSelected) {
            //     PriceValue.push(this.waterPurifierPriseSelected[i].replace("-", " AND "))
            //   }
            // }

            if (query != "WHERE " || PriceValue.length != 0) {
              this.getBottledWaterDispenserFilterData(query, PriceValue);
            } else {
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }

          } else {
            this.waterDispenserSeriesSelected = feilterData.waterDispenserSeriesSelected;
            this.waterDispenserColourSelected = feilterData.waterDispenserColourSelected;
            this.waterDispenserFaucetsSelected = feilterData.waterDispenserFaucetsSelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } else if (this.title == "Visi Cooler") {
      const modalPage = await this.modalCtrl.create({
        component: AppShellPage,
        componentProps: {
          title: this.title,
          visiCoolerSeriesSelected: this.visiCoolerSeriesSelected,
          visiCoolerCapacitySelected: this.visiCoolerCapacitySelected,
          visiCoolerDoorsSelected: this.visiCoolerDoorsSelected,
          visiCoolerCoolingTypeSelected: this.visiCoolerCoolingTypeSelected
        }
      })
      modalPage.onDidDismiss()
        .then((data) => {
          this.filterApply = true;
          let feilterData = data['data']; // Here's your selected user!
          if (feilterData.close == "false") {
            let query = "WHERE ";
              this.visiCoolerSeriesSelected = feilterData.visiCoolerSeriesSelected,
              this.visiCoolerCapacitySelected = feilterData.visiCoolerCapacitySelected,
              this.visiCoolerDoorsSelected = feilterData.visiCoolerDoorsSelected,
              this.visiCoolerCoolingTypeSelected = feilterData.visiCoolerCoolingTypeSelected

            // start flagShowFilter
            if (this.visiCoolerSeriesSelected.length != 0 || this.visiCoolerCapacitySelected.length != 0 || this.visiCoolerDoorsSelected.length != 0 || this.visiCoolerCoolingTypeSelected.length != 0) {
              this.flagShowFilter = true;
              console.log("if", this.flagShowFilter);

              this.compareFlage = false;
              this.compareCount = 0;
              this.showBottomPopup = false;
              this.showComparePopup = false;

            } else {
              this.flagShowFilter = false;
              console.log("else", this.flagShowFilter);
            }
            // end flagShowFilter

            for (let i in this.visiCoolerSeriesSelected) {
              this.firebaseAnalytics.logEvent('visi_cooler_filter', { series: this.visiCoolerSeriesSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.visiCoolerCapacitySelected) {
              this.firebaseAnalytics.logEvent('visi_cooler_filter', { capacity: this.visiCoolerCapacitySelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.visiCoolerDoorsSelected) {
              this.firebaseAnalytics.logEvent('visi_cooler_filter', { doors: this.visiCoolerDoorsSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            for (let i in this.visiCoolerCoolingTypeSelected) {
              this.firebaseAnalytics.logEvent('visi_cooler_filter', { cooling_type: this.visiCoolerCoolingTypeSelected[i] })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            }
            let filterCount = 0;

            if (feilterData.Series != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Series IN " + "(" + feilterData.Series + ") "
                filterCount++;
              } else {
                query = query + "Series IN " + "(" + feilterData.Series + ") "
                filterCount++;
              }
            }

            

            let CapacityValue = []
            let Capacity = ""
            if (this.visiCoolerCapacitySelected.length != 0) {
              for (let i in this.visiCoolerCapacitySelected) {
                let firstValue = this.visiCoolerCapacitySelected[i].split('-')[0]
                let secondValue = this.visiCoolerCapacitySelected[i].split('-')[1]
                var size = Number(secondValue) - Number(firstValue)
                for (let i = 0; i < size; i++) {
                  CapacityValue.push(Number(firstValue) + i)
                }
              }
              for (let item in CapacityValue) {
                if (Capacity.length == 0) {
                  Capacity = Capacity + CapacityValue[item]
                } else {
                  Capacity = Capacity + ',' + CapacityValue[item]
                }
              }
            }

            if (Capacity != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Capacity IN " + "(" + Capacity + ") "
                filterCount++;
              } else {
                query = query + "Capacity IN " + "(" + Capacity + ") "
                filterCount++;
              }
            }

            
            
            if (feilterData.Doors != "") {
              if (filterCount > 0) {
                query = query + "AND " + "Doors IN " + "(" + feilterData.Doors + ") "
                filterCount++;
              } else {
                query = query + "Doors IN " + "(" + feilterData.Doors + ") "
                filterCount++;
              }
            }

            if (feilterData.CoolingType != "") {
              if (filterCount > 0) {
                query = query + "AND " + "CoolingType IN " + "(" + feilterData.CoolingType + ") "
                filterCount++;
              } else {
                query = query + "CoolingType IN " + "(" + feilterData.CoolingType + ") "
                filterCount++;
              }
            }

            let PriceValue = []
            // if (this.waterPurifierPriseSelected.length != 0) {
            //   for (let i in this.waterPurifierPriseSelected) {
            //     PriceValue.push(this.waterPurifierPriseSelected[i].replace("-", " AND "))
            //   }
            // }

            if (query != "WHERE " || PriceValue.length != 0) {
              this.getVisiCoolerFilterData(query, PriceValue);
            } else {
              this.product_listing = this.all_product_listing;
              this.sqlitePagenation()
              this.checkEmptyProductList();
            }

          } else {
            this.visiCoolerSeriesSelected = feilterData.visiCoolerSeriesSelected;
            this.visiCoolerCapacitySelected = feilterData.visiCoolerCapacitySelected;
            this.visiCoolerDoorsSelected = feilterData.visiCoolerDoorsSelected;
            this.visiCoolerCoolingTypeSelected = feilterData.visiCoolerCoolingTypeSelected;

            this.flagShowFilter = false;
            console.log("flag Show Filter", this.flagShowFilter);
          }
        });
      return await modalPage.present();
    } 





  }

  clickOnFavourites(item) {
    if (this.title == "Air Conditioners") {
      this.storeDataInAirConditioner(item)
    } else if (this.title == "Air Coolers") {
      this.storeDataInAirCooler(item)
    } else if (this.title == "Air Purifiers") {
      this.storeDataInAirPurifier(item)
    } else if (this.title == "Water Purifiers") {
      this.storeDataInWaterConditioner(item)
    } else if (this.title == "Deep Freezer") {
      this.storeDataInDeepFreezer(item)
    } else if (this.title == "Bottled Water Dispenser") {
      this.storeDataInBottledWaterDispenser(item)
    } else if (this.title == "Visi Cooler") {
      this.storeDataInVisiCooler(item)
    } 
    
    let data = []
    this.storage.get('favouriteList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('favouriteList', data);
            this.mackFavouritesFlageChange(item)
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('favouriteList', data);
            this.mackFavouritesFlageChange(item)
          }
        } else {
          data.push(item)
          this.storage.set('favouriteList', data);
          this.mackFavouritesFlageChange(item)
        }
      } else {
        data.push(item)
        this.storage.set('favouriteList', data);
        this.mackFavouritesFlageChange(item)
      }
    });
  }


  //Store data function for favorite page start
  storeDataInAirConditioner(item) {
    let data = []
    this.storage.get('airConditionerList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('airConditionerList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('airConditionerList', data);
          }
        } else {
          data.push(item)
          this.storage.set('airConditionerList', data);
        }
      } else {
        data.push(item)
        this.storage.set('airConditionerList', data);
      }
    });
  }

  storeDataInAirCooler(item) {
    let data = []
    this.storage.get('airCoolerList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('airCoolerList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('airCoolerList', data);
          }
        } else {
          data.push(item)
          this.storage.set('airCoolerList', data);
        }
      } else {
        data.push(item)
        this.storage.set('airCoolerList', data);
      }
    });
  }

  storeDataInAirPurifier(item) {
    let data = []
    this.storage.get('airPurifierList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('airPurifierList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('airPurifierList', data);
          }
        } else {
          data.push(item)
          this.storage.set('airPurifierList', data);
        }
      } else {
        data.push(item)
        this.storage.set('airPurifierList', data);
      }
    });
  }

  storeDataInWaterConditioner(item) {
    let data = []
    this.storage.get('waterPurifierList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('waterPurifierList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('waterPurifierList', data);
          }
        } else {
          data.push(item)
          this.storage.set('waterPurifierList', data);
        }
      } else {
        data.push(item)
        this.storage.set('waterPurifierList', data);
      }
    });
  }

  storeDataInDeepFreezer(item) {
    let data = []
    this.storage.get('deepFreezerList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('deepFreezerList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('deepFreezerList', data);
          }
        } else {
          data.push(item)
          this.storage.set('deepFreezerList', data);
        }
      } else {
        data.push(item)
        this.storage.set('deepFreezerList', data);
      }
    });
  }

  storeDataInBottledWaterDispenser(item) {
    let data = []
    this.storage.get('bottledWaterDispenserList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('bottledWaterDispenserList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('bottledWaterDispenserList', data);
          }
        } else {
          data.push(item)
          this.storage.set('bottledWaterDispenserList', data);
        }
      } else {
        data.push(item)
        this.storage.set('bottledWaterDispenserList', data);
      }
    });
  }


  storeDataInVisiCooler(item) {
    let data = []
    this.storage.get('visiCoolerList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('visiCoolerList', data);
          } else {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.storage.set('visiCoolerList', data);
          }
        } else {
          data.push(item)
          this.storage.set('visiCoolerList', data);
        }
      } else {
        data.push(item)
        this.storage.set('visiCoolerList', data);
      }
    });
  }

  //Store data function for favorite page end

  mackFavouritesFlageChange(item) {
    for (let index in this.product_listing) {
      if (this.product_listing[index].ID == item.ID) {
        this.product_listing[index].favouritesFlage = !this.product_listing[index].favouritesFlage
      }
    }
  }

  clickOnProduct(id, text, SKUCode, ProductTitle, Image) {
    this.filterApply = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        title: text,
        SKUCode: SKUCode,
        ProductTitle: ProductTitle,
        Image: Image
      }
    };
    this.router.navigate(['product/' + id], navigationExtras);
  }

  ngOnInit(): void {
    // On init, the route subscription is the active subscription
    this.subscriptions = this.route.data
      .subscribe(
        (resolvedRouteData: IResolvedRouteData<ProductListingModel>) => {
          // Route subscription resolved, now the active subscription is the Observable extracted from the resolved route data
          this.subscriptions = ResolverHelper.extractData<ProductListingModel>(resolvedRouteData.data, ProductListingModel)
            .subscribe(
              (state) => {
                this.listing = state;
              },
              (error) => { }
            );
        },
        (error) => { }
      );
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  onClickSearch(text) {
    this.filterApply = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        title: text
      }
    };
    this.router.navigate(['search/'], navigationExtras);
  }

  onClickFavouritesIcon() {
    this.filterApply = true;
    this.router.navigate(['favourites/']);
  }

  checkEmptyProductList() {
    if (this.product_listing.length == 0) {
      this.emptyListFlage = false
    } else {
      this.emptyListFlage = true
    }
  }

  clickOnCategary(categary) {
    this.filterApply = false;
    if (categary == "Air Conditioners") {
      this.currentTab = "Air Conditioners";
      this.airConditionerFlage = true;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottleWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
    } else if (categary == "Air Coolers") {
      this.currentTab = "Air Coolers";
      this.airConditionerFlage = false;
      this.airCoolerFlage = true;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottleWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
    } else if (categary == "Air Purifiers") {
      this.currentTab = "Air Purifiers";
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = true;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottleWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
    } else if (categary == "Water Purifiers") {
      this.currentTab = "Water Purifiers";
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = true;
      this.deepFreezerFlage = false;
      this.bottleWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
    } else if (categary == "Deep Freezer") {
      this.currentTab = "Deep Freezer";
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = true;
      this.bottleWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
    } else if (categary == "Bottled Water Dispenser") {
      this.currentTab = "Bottled Water Dispenser";
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottleWaterDispenserFlage = true;
      this.visiCoolerFlage = false;
    } else if (categary == "Visi Cooler") {
      this.currentTab = "Visi Cooler";
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottleWaterDispenserFlage = false;
      this.visiCoolerFlage = true;
    }
    this.title = this.currentTab;
    this.getProductData(this.title);
    this.clearFilter();
  }

  downloadPdf(item) {
    let param = {};
    let tableName = ""
    if (this.title == "Air Conditioners") {
      param = { air_conditioner: item.ID }
      tableName = this.table_air_conditioner
    } else if (this.title == "Air Coolers") {
      param = { air_cooler: item.ID }
      tableName = this.table_air_cooler
    } else if (this.title == "Air Purifiers") {
      param = { air_purifier: item.ID }
      tableName = this.table_air_purifier
    } else if (this.title == "Water Purifiers") {
      param = { water_purifier: item.ID }
      tableName = this.table_water_purifier
    } else if (this.title == "Deep Freezer") {
      param = { deep_freezer: item.ID }
      tableName = this.table_deep_freezer
    } else if (this.title == "Bottled Water Dispenser") {
      param = { water_dispenser: item.ID }
      tableName = this.table_bottled_water_dispenser
    } else if (this.title == "Visi Cooler") {
      param = { visi_cooler: item.ID }
      tableName = this.table_visi_cooler
    }

    this.myapp.databaseObj.executeSql(`
    SELECT * FROM ${tableName} WHERE ID = ${item.ID}
    `
      , [])
      .then((res) => {
        if (res.rows.length > 0) {
          let product_data = [];
          for (var i = 0; i < res.rows.length; i++) {
            let rowKeys = []
            let singleRowData = []
            var object = {
              brochures: ""
            };
            rowKeys = Object.keys(res.rows.item(i))
            Object.keys(res.rows.item(i)).map(key => {
              singleRowData.push(res.rows.item(i)[key])
            })
            for (let index in rowKeys) {
              if (rowKeys[index] == "brochures") {
                object[rowKeys[index]] = singleRowData[index]
              }
            }
            product_data.push(object)
          }

          if (product_data[0].brochures == "") {
            this.downloadFuction(item, param)
          } else {
            if (this.platform.is("ios")) {
              const browser = this.inAppBrowser.create(product_data[0].brochures);
              this.firebaseAnalytics.logEvent('downloads_products', { product: item.SKUCode, category: this.title })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            } else {
              console.log("PDF", product_data[0].brochures);
              this.loadingController.create({
                message: 'Please wait while downloading',
              }).then((res) => {
                res.present();
                if (navigator.onLine) {
                  var request: DownloadRequest = {
                    uri: product_data[0].brochures,
                    title: 'Blue Star',
                    description: '',
                    mimeType: 'application/pdf',
                    visibleInDownloadsUi: true,
                    notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
                    destinationInExternalPublicDir: {
                      dirType: 'Download',
                      subPath: item.SKUCode + '.pdf'
                    }
                  };
                  this.downloader.download(request)
                    .then((location: string) => {
                      res.dismiss()
                      this.presentToast("Downloaded in device download folder")
                      this.firebaseAnalytics.logEvent('downloads_products', { product: item.SKUCode, category: this.title })
                        .then((res: any) => console.log(res))
                        .catch((error: any) => console.error(error));
                    })
                    .catch((error: any) => {
                      console.error(error)
                    });
                } else {
                  res.dismiss();
                  console.log("no internat connection")
                }
              })
            }
          }
        } else {
          this.downloadFuction(item, param)
        }
      })
      .catch(e => {
        console.log("error " + JSON.stringify(e))
      });
  }

  downloadFuction(item, param) {
    this.loadingController.create({
      message: 'Please wait while downloading',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_pdf/download', param).subscribe((response) => {
          Object.keys(response).map(key => {
            this.pdf_link = response[key].pdf_link;
            //this.indicatorDownload(item, this.pdf_link);
            if (this.platform.is("ios")) {
              res.dismiss();
              const browser = this.inAppBrowser.create(this.pdf_link);
              this.firebaseAnalytics.logEvent('downloads_products', { product: item.SKUCode, category: this.title })
                .then((res: any) => console.log(res))
                .catch((error: any) => console.error(error));
            } else {
              var request: DownloadRequest = {
                uri: this.pdf_link,
                title: 'Blue Star',
                description: '',
                mimeType: 'application/pdf',
                visibleInDownloadsUi: true,
                notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
                destinationInExternalPublicDir: {
                  dirType: 'Download',
                  subPath: item.SKUCode + '.pdf'
                }
              };
              this.downloader.download(request)
                .then((location: string) => {
                  res.dismiss()
                  this.presentToast("Downloaded in device download folder")
                  this.firebaseAnalytics.logEvent('downloads_products', { product: item.SKUCode, category: this.title })
                    .then((res: any) => console.log(res))
                    .catch((error: any) => console.error(error));
                })
                .catch((error: any) => {
                  console.error(error)
                  res.dismiss();
                });
            }
          })
        }, err => {
          res.dismiss();
          console.log("err.........", JSON.stringify(err))
        });
      } else {
        res.dismiss();
        console.log("no internat connection")
      }
    });
  }

  indicatorDownload(item, pdf_link) {
    if (this.platform.is("ios")) {
      const browser = this.inAppBrowser.create(this.pdf_link);
      this.firebaseAnalytics.logEvent('downloads_products', { product: item.SKUCode, category: this.title })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    } else {
      var request: DownloadRequest = {
        uri: pdf_link,
        title: 'Blue Star',
        description: '',
        mimeType: 'application/pdf',
        visibleInDownloadsUi: true,
        notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
        destinationInExternalPublicDir: {
          dirType: 'Download',
          subPath: item.SKUCode + '.pdf'
        }
      };

      this.loadingController.create({
        message: 'Please wait while downloading',
      }).then((res) => {
        res.present();
        this.downloader.download(request)
          .then((location: string) => {
            res.dismiss()
            this.presentToast("Downloaded in device download folder")
            this.firebaseAnalytics.logEvent('downloads_products', { product: item.SKUCode, category: this.title })
              .then((res: any) => console.log(res))
              .catch((error: any) => console.error(error));
          })
          .catch((error: any) => {
            console.error(error)
            res.dismiss();
          });
      })
    }
  }

  async showSharePopover(ev: any, item) {
    const popover = await this.popoverCtrl.create({
      component: SharePopover,
      event: ev,
      animated: true,
      showBackdrop: true,
      componentProps: { shareDetails: item, title: this.title },
    });
    return await popover.present();
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: 7000,
      position: 'bottom',
      cssClass: "msg-align",
    });
    toast.present();
  }

  getPdfLink(productId, item) {
    let param = {};
    if (this.title == "Air Conditioners") {
      param = { air_conditioner: productId }
    } else if (this.title == "Air Coolers") {
      param = { air_cooler: productId }
    } else if (this.title == "Air Purifiers") {
      param = { air_purifier: productId }
    } else if (this.title == "Water Purifiers") {
      param = { water_purifier: productId }
    } else if (this.title == "Deep Freezer") {
      param = { deep_freezer: productId }
    } else if (this.title == "Bottled Water Dispenser") {
      param = { water_dispenser: productId }
    } else if (this.title == "Visi Cooler") {
      param = { visi_cooler: productId }
    } 

    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_pdf/download', param).subscribe((response) => {
          Object.keys(response).map(key => {
            this.pdf_link = response[key].pdf_link;
            res.dismiss();
            this.shareMethod(item)
          })
        }, err => {
          res.dismiss();
          this.presentToast("No internet connection. Please try again later.")
          console.log("err.........", JSON.stringify(err))
        });
      } else {
        res.dismiss();
        this.presentToast("No internet connection. Please try again later.")
      }
    });
  }

  toDataUrl(url, _this, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result, _this);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  shareMethod(item) {
    this.toDataUrl(item.Image, this, function (myBase64, _this) {
      _this.callMethod(myBase64, item)
    });
  }

  callMethod(myBase64, item) {
    let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
      this.title
      }\nProduct Title: ${item.ProductTitle}\nSKU Code: ${
      item.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    this.socialSharing.share(body, item.ProductTitle.replace(/\%/g, " pc"), myBase64, null)
      .then(sucess => {
        this.firebaseAnalytics.logEvent('share_products', { product: item.SKUCode, category: this.title })
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      })
      .catch(err => {
        console.log(err);
      });
  }

  goToCompare() {
    if (this.compareCount == 0) {
      this.clearFilter();
      this.compareCount = 1;
      this.compareFlage = true;
      console.log("compareFlage", this.compareFlage);

      // Show Compare Flag
      let data = []
      this.storage.get('compareList').then((val) => {
        console.log("compareList", val);
        this.popupCompareList = val;
        if (val != null) {

          data = val;
          let count = 0

          if (data.length != 0) {
            console.log("Enter Show bottom popup", this.popupCompareList);
            this.showBottomPopup = true;
            // this.openBottomPopup();
          }

          for (let index in this.product_listing) {
            for (let item in data) {
              if (this.product_listing[index].ID == data[item].ID) {
                count = 1;
              }
            }
            if (count == 0) {
              this.product_listing[index].showCompareFlage = false
            } else {
              this.product_listing[index].showCompareFlage = true
            }
            count = 0
          }
        } else {
          for (let index in this.product_listing) {
            this.product_listing[index].showCompareFlage = false
          }
        }
      })
      console.log("this.product_listing", this.product_listing);
      // Show Compare Flag End
    }
    else {
      this.compareCount = 0;
      this.compareFlage = false;
      this.showBottomPopup = false;
      this.showComparePopup = false;
      console.log("compareFlage", this.compareFlage);
    }
  }

  getProductaddToCompare(item) {
    console.log("Item Id", item.ID);
    console.log("Title", this.title);

    //  this.route.queryParams.subscribe(params => {
    // this.categoryName = params.title;
    // this.shareDetails = params;
    // if (params && params.title) {
    // this.title = params.title
    let param = {};
    if (this.title == "Air Conditioners") {
      param = { air_conditioner: item.ID }
    } else if (this.title == "Air Coolers") {
      param = { air_cooler: item.ID }
    } else if (this.title == "Air Purifiers") {
      param = { air_purifier: item.ID }
    } else if (this.title == "Water Purifiers") {
      param = { water_purifier: item.ID }
    } else if (this.title == "Deep Freezer") {
      param = { deep_freezer: item.ID }
    } else if (this.title == "Bottled Water Dispenser") {
      param = { water_dispenser: item.ID }
    } else if (this.title == "Visi Cooler") {
      param = { visi_cooler: item.ID }
    }


    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_details', param).subscribe((response) => {
          Object.keys(response).map(key => {
            // console.log("Res", response[key].product_details)
            // this.product_detail = response[key].product_details;
            console.log("step 1");
            this.setData(response[key].product_details);
             console.log("step 2");
            // this.getPdfLink();
            res.dismiss();
          })
        }, err => {
          res.dismiss();
          // this.presentToastInternert("No internet connection. Please try again later.")
          console.log("err.........", JSON.stringify(err))
        });
      } else {
        res.dismiss();
        // this.presentToastInternert("No internet connection. Please try again later.")
      }
    });
    // }
    // })
  }

  setData(value) {
    this.productDetails = [];

    this.images = value.Image;
    for (let data in value) {
      if (data == "product_name") {
        this.productName = value[data][1]
        this.item.ProductTitle = value[data][1]
      }
      if (data == "id") {
        this.item.ID = value[data][1]
      }
      if (data == "sku_model_number") {
        this.item.SKUCode = value[data][1]
        this.SKUCode = value[data][1]

        if (this.platform.is('cordova')) {
          this.firebaseAnalytics.logEvent('product_view', { product: this.SKUCode })
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
        }

      }
      this.item.Image = this.images[0]

      if (data == "mrp") {
        this.item.MRP = value[data][1]
        this.MRP = value[data][1]
      }
      if (data == "mrp_product") {
        this.item.MRP = value[data][1]
        this.MRP = value[data][1]
      }
      if (data == "reasons_to_buy") {
        this.reasonsToBuyFlage = true
        this.reasonsToBuyImageArray = value[data]
      }

      if (data == "brochures") {
        this.brochures = value[data]
      }

      if (data != "Image" && data != "id" && data != "mrp" && data != "brochures" && data != "reasons_to_buy" && data != "mrp_product" && data != "usp") {
        let textValue = ""
        if (value[data][1] == "") {
          textValue = "-"
        } else {
          textValue = value[data][1]
        }
        let object = {
          title: value[data][0],
          value: textValue
        }
        this.productDetails.push(object);
      }
    }
    this.item.productSpecifications = this.productDetails
  
    // this.productDetails.pop();
    // console.log("this.productDetails", this.productDetails);
    // console.log("value", value);
    
    if(value.usp){
      this.uspList = value.usp;
    }else{
      this.uspList = [];
    }
    // console.log("uspList", this.uspList);
    this.item.uspList = this.uspList;

    let data = []
    this.storage.get('favouriteList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          for (let index in data) {
            if (data[index].ID == this.item.ID) {
              count = 1;
              // console.log("favouriteList 1");
            }
          }
          if (count == 0) {
            this.favouritesFlage = false;
            // console.log("favouriteList 2");
          } else {
            this.favouritesFlage = true;
            // console.log("favouriteList 3");
          }
        } else {
          this.favouritesFlage = false;
          // console.log("favouriteList 5");
        }
      } else {
        this.favouritesFlage = false;
        // console.log("favouriteList 6");
      }
    });

    let data_new = []
    this.storage.get('compareList').then((val) => {
      // console.log("compareList", val);
      if (val != null) {
        if (val.length != 0) {
          data_new = val;
          let count = 0;
          for (let index in data_new) {
            if (data_new[index].ID == this.item.ID) {
              count = 1;
            }
          }
          if (count == 0) {
            this.btnCompareText = "Add to Compare";
          } else {
            this.btnCompareText = "Go to Compare";
          }
        } else {
          this.btnCompareText = "Add to Compare";
        }
      } else {
        this.btnCompareText = "Add to Compare";
      }
    });

    // console.log("this.item", this.item);
    this.addToCompare();
  }

  addToCompare() {
    console.log("Enter addToCompare");
    this.storage.get('compareList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          if (val.length < 3) {
            this.storage.get('categaryTitle').then((val) => {
              if (val != null) {
                if (val == this.title) {
                  this.openpopup(this.item);
                } else {
                  // show popup not add to this categary 
                  // this.showAlertErrorLimit();

                  // this.openpopupcomparesamecategory();
                  this.flagSameCategory = true;
                  this.showCompareLimitPopup();
                }
              }
            })
          } else {
            this.openCompareModal(this.item);
          }
        } else {
          this.openpopup(this.item);
        }
      } else {
        this.openpopup(this.item);
      }
    })
  }

  openpopup(item) {
    let data = []
    this.storage.get('compareList').then((val) => {
      data = val;
      let count = 0;
      for (let index in data) {
        if (data[index].ID == item.ID) {
          count = 1;
          this.showAlertErrorAlreadyAdd();
        }
      }
      if (count == 0) {
        // this.alertAddComapreProduct();
        this.addToCompareDataInLocalStorage(this.item)
      }
    })
  }

  async showAlertErrorLimit() {
    const alert = await this.alertController.create({
      header: "Please add the product of the same category for comparison",
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // this.removeFromFavourites(id)
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async openpopupcomparesamecategory() {
    const modal = await this.modalCtrl.create({
      component: popupcomparesamecategory,
      componentProps: { title: this.title},
      cssClass: "my-modal",
      backdropDismiss: false
    });
    modal.onDidDismiss().then((modalData) => {
      this.checkCompareData();
      this.getCompareList();
    });

    return await modal.present();
  }

  openCompareModal(item) {
    let data = []
    this.storage.get('compareList').then((val) => {
      data = val;
      let count = 0;
      for (let index in data) {
        if (data[index].ID == item.ID) {
          count = 1;
          this.showAlertErrorAlreadyAdd();
        }
      }
      if (count == 0) {
        // this.openBottomPopup();
        // this.showBottomPopup = true;

        this.showCompareLimitPopup();
        
      }
    })
  }

  async showAlertErrorAlreadyAdd() {
    const alert = await this.alertController.create({
      header: "Product already added to compare list",
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // this.removeFromFavourites(id)
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async alertAddComapreProduct() {
    const alert = await this.alertController.create({
      header: "Are you sure you want to add compare product?",
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss();
          }
        }, {
          text: 'OK',
          handler: () => {
            this.addToCompareDataInLocalStorage(this.item)
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async openBottomPopup() {
    const modal = await this.modalCtrl.create({
      component: PopupCompare,
      componentProps: {
        title: this.title,
      },
      cssClass: "my-modal",
      backdropDismiss: false
    });

    modal.onDidDismiss().then((modalData) => {
      this.checkCompareData();
      this.getCompareList();
    });

    return await modal.present();
  }

  addToCompareDataInLocalStorage(item) {
    let data = []
    this.storage.get('compareList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          for (let index in data) {
            if (data[index].ID == item.ID) {
              count = 1;
              this.showAlertErrorAlreadyAdd();
            }
          }
          if (count == 0) {
            data.push(item)
            this.storage.set('compareList', data);
            console.log("Push 1");

            this.showBottomPopup = true;
            // this.openBottomPopup();

            // Show Compare Flag
            let data_new = []
            // this.storage.get('compareList').then((val) => {
            //   console.log("compareList", val);

            this.popupCompareList = data;
            console.log("popupCompareList", this.popupCompareList);
            if (data != null) {
              data_new = data;
              let count = 0
              for (let index in this.product_listing) {
                for (let item in data_new) {
                  if (this.product_listing[index].ID == data_new[item].ID) {
                    count = 1;
                  }
                }
                if (count == 0) {
                  this.product_listing[index].showCompareFlage = false
                } else {
                  this.product_listing[index].showCompareFlage = true
                }
                count = 0
              }
            } else {
              for (let index in this.product_listing) {
                this.product_listing[index].showCompareFlage = false
              }
            }
            // })
            console.log("this.product_listing****3", this.product_listing);
            // Show Compare Flag End


          }
        } else {
          data.push(item)
          console.log("Data", data);
          this.storage.set('compareList', data);
          console.log("Push 2");
          this.showBottomPopup = true;
          // this.openBottomPopup();
          // this.storage.get('compareList').then((val) => {
          //   console.log("compareList", val);
          // })

          // Show Compare Flag
          let data_new = []
          // this.storage.get('compareList').then((val) => {
          //   console.log("compareList", val);
          this.popupCompareList = data;
          console.log("popupCompareList", this.popupCompareList);
          if (data != null) {
            data_new = data;
            let count = 0
            for (let index in this.product_listing) {
              for (let item in data_new) {
                if (this.product_listing[index].ID == data_new[item].ID) {
                  count = 1;
                }
              }
              if (count == 0) {
                this.product_listing[index].showCompareFlage = false
              } else {
                this.product_listing[index].showCompareFlage = true
              }
              count = 0
            }
          } else {
            for (let index in this.product_listing) {
              this.product_listing[index].showCompareFlage = false
            }
          }
          // })
          // console.log("this.product_listing****3", this.product_listing);
          // Show Compare Flag End

        }
      } else {
        data.push(item)
        this.storage.set('compareList', data);
        this.showBottomPopup = true;

        // Show Compare Flag
        let data_new = []
        this.storage.get('compareList').then((val) => {
          this.popupCompareList = val;

          if (val != null) {
            data_new = val;
            let count = 0
            for (let index in this.product_listing) {
              for (let item in data_new) {
                if (this.product_listing[index].ID == data_new[item].ID) {
                  count = 1;
                }
              }
              if (count == 0) {
                this.product_listing[index].showCompareFlage = false
              } else {
                this.product_listing[index].showCompareFlage = true
              }
              count = 0
            }
          } else {
            for (let index in this.product_listing) {
              this.product_listing[index].showCompareFlage = false
            }
          }
        })
        // console.log("this.product_listing****3", this.product_listing);
        // Show Compare Flag End
      }
    });
    this.storage.set('categaryTitle', this.title);
  }

  async showAlertRemoveProduct(id) {
    const alert = await this.alertController.create({
      header: "Are you sure you want to remove product in compare product?",
      cssClass: 'variant-alert size-chooser',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss();
          }
        }, {
          text: 'OK',
          handler: () => {
            this.removeProductFromCompareList(id);
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
    // }

  }

  removeProductFromCompareList(id) {
    let data = []
    this.storage.get('compareList').then((val) => {
      if (val != null) {
        if (val.length != 0) {
          data = val;
          let count = 0;
          let removeItemIndex = 0;
          for (let index in data) {
            if (data[index].ID == id) {
              count = 1;
              removeItemIndex = Number(index)
            }
          }
          if (count == 1) {
            //remove product from Favourites list
            data.splice(removeItemIndex, 1)
            this.popupCompareList = data;
            this.storage.set('compareList', data);
            this.noRecords = this.popupCompareList.length;
            this.refreshCompareData(data);

          }
        }
      }
    });
  }

  checkCompareData() {
    // Show Compare Flag
    // console.log("check Compare Data");
    let data = []
    this.storage.get('compareList').then((val) => {
      if (val != null) {
        data = val;
        let count = 0
        for (let index in this.product_listing) {
          for (let item in data) {
            if (this.product_listing[index].ID == data[item].ID) {
              count = 1;
            }
          }
          if (count == 0) {
            this.product_listing[index].showCompareFlage = false;
          } else {
            this.product_listing[index].showCompareFlage = true;
          }
          count = 0
        }
      } else {
        for (let index in this.product_listing) {
          this.product_listing[index].showCompareFlage = false;
        }
      }
    })
    // console.log("this.product_listing********", this.product_listing);
    // Show Compare Flag End
  }

  refreshCompareData(data) {
    // Show Compare Flag
    let data_new = []
    this.popupCompareList = data;
    console.log("popupCompareList", this.popupCompareList);
    if (data != null) {
      data_new = data;
      let count = 0
      for (let index in this.product_listing) {
        for (let item in data_new) {
          if (this.product_listing[index].ID == data_new[item].ID) {
            count = 1;
          }
        }
        if (count == 0) {
          this.product_listing[index].showCompareFlage = false
        } else {
          this.product_listing[index].showCompareFlage = true
        }
        count = 0
      }
    } else {
      for (let index in this.product_listing) {
        this.product_listing[index].showCompareFlage = false
      }
    }
    console.log("refresh product_listing", this.product_listing);
    // Show Compare Flag End
  }

  getCompareList() {
    this.storage.get('compareList').then((val) => {
      this.popupCompareList = val;
    })
  }

  onClickCompareNow() {
    this.showBottomPopup = false;
    this.showComparePopup = false;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        title: this.title,
      }
    };
    this.router.navigate(['compare/'], navigationExtras);
  }

  closeBottomPopup() {
    this.showBottomPopup = false;
  }

   // ******* showCompareLimitPopup *********

   showCompareLimitPopup(){
    this.getCompareList();
    this.showComparePopup = true;
    this.showBottomPopup = false;
    this.content.scrollToPoint(0, 0, 1000);
  }

  closeComparePopup(){
    this.showComparePopup = false;
    this.showBottomPopup = true;
    this.checkCompareData();
    this.getCompareList();
  }

  getComapreProductList() {
    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      this.storage.get('compareList').then((val) => {
        res.dismiss();
        if (val != null) {
          this.popupCompareList = val;
          this.noRecords2 = this.popupCompareList.length;
          console.log("compare_product_listing", this.popupCompareList);
        }
      }, err => {
        console.log("err.........", err)
        res.dismiss();
      });
    });
  }

  AddIds(id) {
    let index_of_id = this.selectedIDs.indexOf(id);
    if (index_of_id < 0) {
      this.selectedIDs.push(id);
    } else {
      this.selectedIDs.splice(index_of_id, 1);
    }
  }

  removeProductFromComparePopup() {
    if(this.selectedIDs.length >= 3){
      this.popupCompareList = [];
      this.storage.set('compareList', this.popupCompareList);
      this.selectedIDs = [];
      this.getComapreProductList();
    }else{
      let data = []
      this.storage.get('compareList').then((val) => {
        if (val != null) {
          if (val.length != 0) {
            data = this.popupCompareList;
            var newArr = [];
            for (let index in data) {
              let index_of_id = this.selectedIDs.indexOf(data[index].ID + "");
              if (this.selectedIDs.includes(data[index].ID + "")) {
                data[index] = null;
              } else {
                newArr.push(data[index]);
              }
            }
            this.popupCompareList = newArr;
            this.storage.set('compareList', newArr);
            this.getComapreProductList();
          }
        }
      });
    }
    // this.getComapreProductList();
   
  }


  checkData1(){
    return this.myapp.databaseObj.executeSql('SELECT * FROM deep_freezer', []).then(res => {
      let items: Song[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
          console.log(res.rows);
          // items.push({ 
          //   id: res.rows.item(i).id[0],
          //   product_name: res.rows.item(i).product_name[0],  
          //  });
        }
      }
      // this.songsList.next(items);
      // console.log("my items", items);

    });
  }

  checkData2(){
    return this.myapp.databaseObj.executeSql('SELECT * FROM air_cooler', []).then(res => {
      let items: Song[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) { 
           console.log(res.rows);
          // items.push({ 
          //   id: res.rows.item(i).id[0],
          //   product_name: res.rows.item(i).product_name[0],  
          //  });
        }
      }
      // this.songsList.next(items);
      // console.log("my items", items);

    });
  }



}
