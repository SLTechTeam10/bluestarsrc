import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../utils/resolver-helper';
import { SearchProductModel } from './search-product.model';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ModalController, PopoverController, ToastController, IonInfiniteScroll, IonContent } from '@ionic/angular';
import { AppShellPage } from '../showcase/app-shell/app-shell.page';
import { Storage } from '@ionic/storage';
import { AppComponent } from "./../app.component";
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { CategoriesPage } from "./../categories/categories.page";

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.page.html',
  styleUrls: [
    './styles/search-product.page.scss',
    './styles/search-product.shell.scss'
  ]
})
export class SearchProductPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: true }) content: IonContent;
  subscriptions: Subscription;
  pdf_link: any;
  listing: SearchProductModel;
  title = '';
  product_listing = [];
  searchTerm = ""
  emptyDataFlage = false;
  total_product: number;

  data = [];
  page = 1;
  pagenationProductCount = 20;

  readonly table_air_conditioner: string = "air_conditioner";
  readonly table_air_cooler: string = "air_cooler";
  readonly table_air_purifier: string = "air_purifier";
  readonly table_water_purifier: string = "water_purifier";
  readonly table_deep_freezer: string = "deep_freezer";
  readonly table_bottled_water_dispenser: string = "bottled_water_dispenser";
  readonly table_visi_cooler: string = "visi_cooler";

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router
    , public loadingController: LoadingController, public modalCtrl: ModalController,
    private storage: Storage, public myapp: AppComponent, private downloader: Downloader,
    private toastCtrl: ToastController,
    private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics,
    private inAppBrowser: InAppBrowser,
    private categoriesPage: CategoriesPage,
    private socialSharing: SocialSharing) {
    this.route.queryParams.subscribe(params => {
      if (params && params.title) {
        this.title = params.title
      }
    });
  }

  formatNumber(item) {
    var number = item.MRP ? item.MRP : item.Price;
    return new Intl.NumberFormat('en-IN').format(number);
  }

  onChange(searchTerm, event) {
    if (searchTerm.length > 1) {
      this.getSearchData(searchTerm)
    } else {
      this.product_listing = [];
      this.emptyDataFlage = false
    }
  }

  getSearchData(searchText) {
    let param = {};
    if (this.title == "Air Conditioners") {
      param = { product_category: "air_conditioner", search_text: searchText }
    } else if (this.title == "Air Coolers") {
      param = { product_category: "air_cooler", search_text: searchText }
    } else if (this.title == "Air Purifiers") {
      param = { product_category: "air_purifier", search_text: searchText }
    } else if (this.title == "Water Purifiers") {
      param = { product_category: "water_purifier", search_text: searchText }
    } else if (this.title == "Deep Freezer") {
      param = { product_category: "deep_freezer", search_text: searchText }
    } else if (this.title == "Bottled Water Dispenser") {
      param = { product_category: "water_dispenser", search_text: searchText }
    } else if (this.title == "Visi Cooler") {
      param = { product_category: "visi_cooler", search_text: searchText }
    }

    this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_search', param).subscribe((response) => {
      Object.keys(response).map(key => {
        if (response[key].product_listing == undefined) {
          this.product_listing = [];
          this.total_product = this.product_listing.length;
          console.log("total_product If", this.total_product);
        } else {

          this.product_listing = [];
          this.data = response[key].product_listing;
         
          this.page = 1;
          this.content.scrollToTop(0);
          for (let i = 0; i < this.data.length; i++) {
            if (i < this.page * this.pagenationProductCount) {
              this.product_listing.push(this.data[i]);
            }
          }

          console.log("product_listing***", this.product_listing);
          // this.product_listing = response[key].product_listing;

          this.product_listing.sort(function (a, b) {   // finally sort what remains
            if (Number(a.MRP) < Number(b.MRP)) {
              return -1;
            }
            else if (Number(a.MRP) > Number(b.MRP)) {
              return 1;
            }
            else {
              return 0;
            }
          });
          // this.total_product = this.product_listing.length;
          this.total_product = response[key].total_result_count;
          console.log("total_product", this.total_product);
        }
        if (this.product_listing.length == 0) {
          this.emptyDataFlage = true
        } else {
          this.emptyDataFlage = false
        }
        this.ckeckFavourateProduct();
      })
    }, err => {
      console.log("err.........", JSON.stringify(err))
    });
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
        console.log("product_listing Load New", this.product_listing);
        this.ckeckFavourateProduct();
        this.page++;
        //event.target.disabled = true;
      }, 500);
    } else {
      event.target.complete();
    }

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

  mackFavouritesFlageChange(item) {
    for (let index in this.product_listing) {
      if (this.product_listing[index].ID == item.ID) {
        this.product_listing[index].favouritesFlage = !this.product_listing[index].favouritesFlage
      }
    }
  }

  clickOnProduct(id, text) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
        title: text
      }
    };
    this.router.navigate(['product/' + id], navigationExtras);
  }

  ngOnInit(): void {
    // On init, the route subscription is the active subscription
    this.subscriptions = this.route.data
      .subscribe(
        (resolvedRouteData: IResolvedRouteData<SearchProductModel>) => {
          // Route subscription resolved, now the active subscription is the Observable extracted from the resolved route data
          this.subscriptions = ResolverHelper.extractData<SearchProductModel>(resolvedRouteData.data, SearchProductModel)
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
    // console.log('TravelListingPage [ionViewWillLeave]');
    this.subscriptions.unsubscribe();
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
        console.log("err....", err);
      });
  }
}
