import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, ToastController, PopoverController, IonContent } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AppComponent } from "./../app.component";
import { HttpClient } from '@angular/common/http';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { CategoriesPage } from "./../categories/categories.page";

@Component({
  selector: 'app-categories',
  templateUrl: './favourites.page.html',
  styleUrls: [
    './styles/favourites.page.scss',
    './styles/favourites.shell.scss',
    './styles/favourites.responsive.scss'
  ]
})
export class FavouritesPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  product_listing = [];
  allProductList = [];
  airConditionerList = [];
  airCoolerList = [];
  airPurifierList = [];
  waterPurifierList = [];
  deepFreezerList = [];
  bottledWaterDispenserList = [];
  visiCoolerList = [];

  allProductFlage = true;
  airConditionerFlage = false;
  airCoolerFlage = false;
  airPurifierFlage = false;
  waterPurifierFlage = false;
  deepFreezerFlage = false;
  bottledWaterDispenserFlage = false;
  visiCoolerFlage = false;

  currentTab = "All";
  total_product: number;

  title: any;
  pdf_link: any;
  showPopup: boolean = false;

  readonly table_air_conditioner: string = "air_conditioner";
  readonly table_air_cooler: string = "air_cooler";
  readonly table_air_purifier: string = "air_purifier";
  readonly table_water_purifier: string = "water_purifier";
  readonly table_deep_freezer: string = "deep_freezer";
  readonly table_bottled_water_dispenser: string = "bottled_water_dispenser";
  readonly table_visi_cooler: string = "visi_cooler";

  constructor(private storage: Storage, public alertController: AlertController
    , private router: Router, public loadingController: LoadingController,
    public myapp: AppComponent, private http: HttpClient, private toastCtrl: ToastController,
    private downloader: Downloader,
    private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private firebaseAnalytics: FirebaseAnalytics,
    private categoriesPage: CategoriesPage,
    private socialSharing: SocialSharing) {


  }

  ionViewWillEnter() {
    console.log("Enter ionViewWillEnter");
    this.storage.get('favouriteList').then((val) => {
      if (val != null) {
        this.product_listing = val;
        this.allProductList = val;
        this.total_product = this.product_listing.length;
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
      }
    });

    this.storage.get('airConditionerList').then((val) => {
      if (val != null) {
        this.airConditionerList = val;
      }
    })

    this.storage.get('airCoolerList').then((val) => {
      if (val != null) {
        this.airCoolerList = val;
      }
    })

    this.storage.get('airPurifierList').then((val) => {
      if (val != null) {
        this.airPurifierList = val;
      }
    })

    this.storage.get('waterPurifierList').then((val) => {
      if (val != null) {
        this.waterPurifierList = val;
      }
    })

    this.storage.get('deepFreezerList').then((val) => {
      if (val != null) {
        this.deepFreezerList = val;
      }
    })

    this.storage.get('bottledWaterDispenserList').then((val) => {
      if (val != null) {
        this.bottledWaterDispenserList = val;
      }
    })

    this.storage.get('visiCoolerList').then((val) => {
      if (val != null) {
        this.visiCoolerList = val;
      }
    })

  }

  clickOnCategary(categary) {
    if (categary == "Air Conditioners") {
      this.currentTab = "Air Conditioners";
      this.product_listing = this.airConditionerList;
      this.airConditionerFlage = true;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;
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

    } else if (categary == "Air Coolers") {
      this.currentTab = "Air Coolers";
      this.product_listing = this.airCoolerList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = true;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;

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

    } else if (categary == "Air Purifiers") {
      this.currentTab = "Air Purifiers";
      this.product_listing = this.airPurifierList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = true;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;
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


    } else if (categary == "Water Purifiers") {
      this.currentTab = "Water Purifiers";
      this.product_listing = this.waterPurifierList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = true;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;

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

    } else if (categary == "Deep Freezer") {
      this.currentTab = "Deep Freezer";
      this.product_listing = this.deepFreezerList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = true;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;

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

    } else if (categary == "Bottled Water Dispenser") {
      this.currentTab = "Bottled Water Dispenser";
      this.product_listing = this.bottledWaterDispenserList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = true;
      this.visiCoolerFlage = false;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;

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

    } else if (categary == "Visi Cooler") {
      this.currentTab = "Visi Cooler";
      this.product_listing = this.visiCoolerList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = true;
      this.allProductFlage = false;

      this.total_product = this.product_listing.length;

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

    } else if (categary == "All") {
      this.currentTab = "All";
      this.product_listing = this.allProductList;
      this.airConditionerFlage = false;
      this.airCoolerFlage = false;
      this.airPurifierFlage = false;
      this.waterPurifierFlage = false;
      this.deepFreezerFlage = false;
      this.bottledWaterDispenserFlage = false;
      this.visiCoolerFlage = false;
      this.allProductFlage = true;

      this.total_product = this.product_listing.length;

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
    }
  }

  formatNumber(item) {
    var number = item.MRP ? item.MRP : item.Price;
    return new Intl.NumberFormat('en-IN').format(number);
  }

  ngOnInit(): void {
    this.product_listing = [];
    this.allProductList = [];
    this.airConditionerList = [];
    this.airCoolerList = [];
    this.airPurifierList = [];
    this.waterPurifierList = [];
    this.deepFreezerList = [];
    this.bottledWaterDispenserList = [];
    this.visiCoolerList = [];
  }

  async deleteImage(id) {
    const alert = await this.alertController.create({
      // header: "Confirmation",
      header: "Are you sure you'd like to remove this product from My Products?",
      // message: "Are you sure you'd like to remove this product from My Products?",
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
            this.removeFromFavourites(id);
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }


  // deleteImage(){
  //   this.showPopup = true;
  //   this.content.scrollToPoint(0, 0, 1000)
  // }

  // close() {
  //   this.showPopup = false;
  // }

  removeFromFavourites(id) {
    // console.log("id", id);
    // this.showPopup = false;
    let data = []
    this.storage.get('favouriteList').then((val) => {
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
            this.product_listing = data;
            this.allProductList = data;
            this.storage.set('favouriteList', data);
            this.total_product = this.total_product - 1;
          }
        }
      }

      let count1 = 0;
      let count2 = 0;
      let count3 = 0;
      let count4 = 0;
      let count5 = 0;
      let count6 = 0;
      let count7 = 0;

      let removeItemIndex1 = 0;
      let removeItemIndex2 = 0;
      let removeItemIndex3 = 0;
      let removeItemIndex4 = 0;
      let removeItemIndex5 = 0;
      let removeItemIndex6 = 0;
      let removeItemIndex7 = 0;

      for (let index in this.airConditionerList) {
        if (this.airConditionerList[index].ID == id) {
          count1 = 1
          removeItemIndex1 = Number(index);
        }
      }

      if (count1 == 1) {
        this.airConditionerList.splice(removeItemIndex1, 1)
        this.storage.set('airConditionerList', this.airConditionerList);

      }

      for (let index in this.airCoolerList) {
        if (this.airCoolerList[index].ID == id) {
          count2 = 1
          removeItemIndex2 = Number(index);
        }
      }

      if (count2 == 1) {
        this.airCoolerList.splice(removeItemIndex2, 1)
        this.storage.set('airCoolerList', this.airCoolerList);

      }

      for (let index in this.airPurifierList) {
        if (this.airPurifierList[index].ID == id) {
          count3 = 1
          removeItemIndex3 = Number(index);
        }
      }

      if (count3 == 1) {
        this.airPurifierList.splice(removeItemIndex3, 1)
        this.storage.set('airPurifierList', this.airPurifierList);

      }

      for (let index in this.waterPurifierList) {
        if (this.waterPurifierList[index].ID == id) {
          count4 = 1
          removeItemIndex4 = Number(index);
        }
      }

      if (count4 == 1) {
        this.waterPurifierList.splice(removeItemIndex4, 1)
        this.storage.set('waterPurifierList', this.waterPurifierList);
      }


      for (let index in this.deepFreezerList) {
        if (this.deepFreezerList[index].ID == id) {
          count5 = 1
          removeItemIndex5 = Number(index);
        }
      }

      if (count5 == 1) {
        this.deepFreezerList.splice(removeItemIndex5, 1)
        this.storage.set('deepFreezerList', this.deepFreezerList);
      }


      for (let index in this.bottledWaterDispenserList) {
        if (this.bottledWaterDispenserList[index].ID == id) {
          count6 = 1
          removeItemIndex6 = Number(index);
        }
      }

      if (count6 == 1) {
        this.bottledWaterDispenserList.splice(removeItemIndex6, 1)
        this.storage.set('bottledWaterDispenserList', this.bottledWaterDispenserList);
      }

      for (let index in this.visiCoolerList) {
        if (this.visiCoolerList[index].ID == id) {
          count7 = 1
          removeItemIndex7 = Number(index);
        }
      }

      if (count7 == 1) {
        this.visiCoolerList.splice(removeItemIndex7, 1)
        this.storage.set('visiCoolerList', this.visiCoolerList);
      }


      if (this.currentTab == "Air Conditioners") {
        this.product_listing = this.airConditionerList;
      } else if (this.currentTab == "Air Coolers") {
        this.product_listing = this.airCoolerList;
      } else if (this.currentTab == "Air Purifiers") {
        this.product_listing = this.airPurifierList;
      } else if (this.currentTab == "Water Purifiers") {
        this.product_listing = this.waterPurifierList;
      } else if (this.currentTab == "Deep Freezer") {
        this.product_listing = this.deepFreezerList;
      } else if (this.currentTab == "Bottled Water Dispenser") {
        this.product_listing = this.bottledWaterDispenserList;
      } else if (this.currentTab == "Visi Cooler") {
        this.product_listing = this.visiCoolerList;
      } else if (this.currentTab == "All") {
        this.product_listing = this.allProductList;
      }
    });
  }

  // removeFromFavourites(id) {
  //   let data = []
  //   this.storage.get('favouriteList').then((val) => {
  //     if (val != null) {
  //       if (val.length != 0) {
  //         data = val;
  //         let count = 0;
  //         let removeItemIndex = 0;
  //         for (let index in data) {
  //           if (data[index].ID == id) {
  //             count = 1;
  //             removeItemIndex = Number(index)
  //           }
  //         }
  //         if (count == 1) {
  //           //remove product from Favourites list
  //           data.splice(removeItemIndex, 1)
  //           this.product_listing = data;
  //           this.allProductList = data;
  //           this.storage.set('favouriteList', data);
  //           this.total_product = this.total_product - 1;
  //         }
  //       }
  //     }

  //     let count1 = 0;
  //     let count2 = 0;
  //     let count3 = 0;
  //     let count4 = 0;

  //     let removeItemIndex1 = 0;
  //     let removeItemIndex2 = 0;
  //     let removeItemIndex3 = 0;
  //     let removeItemIndex4 = 0;
  //     for (let index in this.airConditionerList) {
  //       if (this.airConditionerList[index].ID == id) {
  //         count1 = 1
  //         removeItemIndex1 = Number(index);
  //       }
  //     }

  //     if (count1 == 1) {
  //       this.airConditionerList.splice(removeItemIndex1, 1)
  //       this.storage.set('airConditionerList', this.airConditionerList);

  //     }

  //     for (let index in this.airCoolerList) {
  //       if (this.airCoolerList[index].ID == id) {
  //         count2 = 1
  //         removeItemIndex2 = Number(index);
  //       }
  //     }

  //     if (count2 == 1) {
  //       this.airCoolerList.splice(removeItemIndex2, 1)
  //       this.storage.set('airCoolerList', this.airCoolerList);

  //     }

  //     for (let index in this.airPurifierList) {
  //       if (this.airPurifierList[index].ID == id) {
  //         count3 = 1
  //         removeItemIndex3 = Number(index);
  //       }
  //     }

  //     if (count3 == 1) {
  //       this.airPurifierList.splice(removeItemIndex3, 1)
  //       this.storage.set('airPurifierList', this.airPurifierList);

  //     }

  //     for (let index in this.waterPurifierList) {
  //       if (this.waterPurifierList[index].ID == id) {
  //         count4 = 1
  //         removeItemIndex4 = Number(index);
  //       }
  //     }

  //     if (count4 == 1) {
  //       this.waterPurifierList.splice(removeItemIndex4, 1)
  //       this.storage.set('waterPurifierList', this.waterPurifierList);
  //     }

  //     if (this.currentTab == "Air Conditioners") {
  //       this.product_listing = this.airConditionerList;
  //     } else if (this.currentTab == "Air Coolers") {
  //       this.product_listing = this.airCoolerList;
  //     } else if (this.currentTab == "Air Purifiers") {
  //       this.product_listing = this.airPurifierList;
  //     } else if (this.currentTab == "Water Purifiers") {
  //       this.product_listing = this.waterPurifierList;
  //     } else if (this.currentTab == "All") {
  //       this.product_listing = this.allProductList;
  //     }
  //   });
  // }

  goToProductDetalPage(id, skuCode, ProductTitle, Image) {
    let flage = 0
    for (let i in this.airConditionerList) {
      if (this.airConditionerList[i].ID == id && this.airConditionerList[i].SKUCode == skuCode) {
        flage = 1
        let navigationExtras: NavigationExtras = {
          queryParams: {
            id: id,
            title: "Air Conditioners",
            SKUCode: skuCode,
            ProductTitle: ProductTitle,
            Image: Image
          }
        };
        this.router.navigate(['product/' + id], navigationExtras);
      }
    }

    if (flage == 0) {
      for (let i in this.airCoolerList) {
        if (this.airCoolerList[i].ID == id && this.airCoolerList[i].SKUCode == skuCode) {
          flage = 1
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: id,
              title: "Air Coolers",
              SKUCode: skuCode,
              ProductTitle: ProductTitle,
              Image: Image
            }
          };
          this.router.navigate(['product/' + id], navigationExtras);
        }
      }
    }

    if (flage == 0) {
      for (let i in this.airPurifierList) {
        if (this.airPurifierList[i].ID == id && this.airPurifierList[i].SKUCode == skuCode) {
          flage = 1
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: id,
              title: "Air Purifiers",
              SKUCode: skuCode,
              ProductTitle: ProductTitle,
              Image: Image
            }
          };
          this.router.navigate(['product/' + id], navigationExtras);
        }
      }
    }

    if (flage == 0) {
      for (let i in this.waterPurifierList) {
        if (this.waterPurifierList[i].ID == id && this.waterPurifierList[i].SKUCode == skuCode) {
          flage = 1
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: id,
              title: "Water Purifiers",
              SKUCode: skuCode,
              ProductTitle: ProductTitle,
              Image: Image
            }
          };
          this.router.navigate(['product/' + id], navigationExtras);
        }
      }
    }

    if (flage == 0) {
      for (let i in this.deepFreezerList) {
        if (this.deepFreezerList[i].ID == id && this.deepFreezerList[i].SKUCode == skuCode) {
          flage = 1
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: id,
              title: "Deep Freezer",
              SKUCode: skuCode,
              ProductTitle: ProductTitle,
              Image: Image
            }
          };
          this.router.navigate(['product/' + id], navigationExtras);
        }
      }
    }

    if (flage == 0) {
      for (let i in this.bottledWaterDispenserList) {
        if (this.bottledWaterDispenserList[i].ID == id && this.bottledWaterDispenserList[i].SKUCode == skuCode) {
          flage = 1
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: id,
              title: "Bottled Water Dispenser",
              SKUCode: skuCode,
              ProductTitle: ProductTitle,
              Image: Image
            }
          };
          this.router.navigate(['product/' + id], navigationExtras);
        }
      }
    }

    if (flage == 0) {
      for (let i in this.visiCoolerList) {
        if (this.visiCoolerList[i].ID == id && this.visiCoolerList[i].SKUCode == skuCode) {
          flage = 1
          let navigationExtras: NavigationExtras = {
            queryParams: {
              id: id,
              title: "Visi Cooler",
              SKUCode: skuCode,
              ProductTitle: ProductTitle,
              Image: Image
            }
          };
          this.router.navigate(['product/' + id], navigationExtras);
        }
      }
    }

  }

  downloadPdf(item) {
    let flage = 0
    for (let i in this.airConditionerList) {
      if (this.airConditionerList[i].ID == item.ID && this.airConditionerList[i].SKUCode == item.SKUCode) {
        flage = 1
        this.title = "Air Conditioners";
      }
    }

    if (flage == 0) {
      for (let i in this.airCoolerList) {
        if (this.airCoolerList[i].ID == item.ID && this.airCoolerList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Air Coolers";
        }
      }
    }

    if (flage == 0) {
      for (let i in this.airPurifierList) {
        if (this.airPurifierList[i].ID == item.ID && this.airPurifierList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Air Purifiers";
        }
      }
    }

    if (flage == 0) {
      for (let i in this.waterPurifierList) {
        if (this.waterPurifierList[i].ID == item.ID && this.waterPurifierList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Water Purifiers";
        }
      }
    }

    if (flage == 0) {
      for (let i in this.deepFreezerList) {
        if (this.deepFreezerList[i].ID == item.ID && this.deepFreezerList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Deep Freezer";
        }
      }
    }

    if (flage == 0) {
      for (let i in this.bottledWaterDispenserList) {
        if (this.bottledWaterDispenserList[i].ID == item.ID && this.bottledWaterDispenserList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Bottled Water Dispenser";
        }
      }
    }

    if (flage == 0) {
      for (let i in this.visiCoolerList) {
        if (this.visiCoolerList[i].ID == item.ID && this.visiCoolerList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Visi Cooler";
        }
      }
    }

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

  showSharePopover(id, item) {
    let flage = 0
    for (let i in this.airConditionerList) {
      if (this.airConditionerList[i].ID == item.ID && this.airConditionerList[i].SKUCode == item.SKUCode) {
        flage = 1
        this.title = "Air Conditioners";
      }
    }
    if (flage == 0) {
      for (let i in this.airCoolerList) {
        if (this.airCoolerList[i].ID == item.ID && this.airCoolerList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Air Coolers";
        }
      }
    }
    if (flage == 0) {
      for (let i in this.airPurifierList) {
        if (this.airPurifierList[i].ID == item.ID && this.airPurifierList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Air Purifiers";
        }
      }
    }
    if (flage == 0) {
      for (let i in this.waterPurifierList) {
        if (this.waterPurifierList[i].ID == item.ID && this.waterPurifierList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Water Purifiers";
        }
      }
    }
    if (flage == 0) {
      for (let i in this.deepFreezerList) {
        if (this.deepFreezerList[i].ID == item.ID && this.deepFreezerList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Deep Freezer";
        }
      }
    }
    if (flage == 0) {
      for (let i in this.bottledWaterDispenserList) {
        if (this.bottledWaterDispenserList[i].ID == item.ID && this.bottledWaterDispenserList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Bottled Water Dispenser";
        }
      }
    }
     if (flage == 0) {
      for (let i in this.visiCoolerList) {
        if (this.visiCoolerList[i].ID == item.ID && this.visiCoolerList[i].SKUCode == item.SKUCode) {
          flage = 1
          this.title = "Visi Cooler";
        }
      }
    }
    this.getPdfLink(id, item)
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
}
