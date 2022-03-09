import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { AlertController, IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { ProductDetailsModel } from './product-details.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, PopoverController, Platform, ModalController,IonContent } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { CategoriesPage } from "./../../categories/categories.page";
import { AppComponent } from "./../../app.component";
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PopupCompare } from '../../popup-compare/popup-compare';
import { PopupReasonToBuy } from '../../popup-reason-to-buy/popup-reason-to-buy';
import { popupcomparesamecategory } from '../../popup-compare-same-category/popup-compare-same-category';
// import { ZoomPopup } from '../../zoom-popup/zoom-popup';
// import { PopupZoomPage } from '../../popup-zoom/popup-zoom.page';

@Component({
   selector: 'app-product-details',
   templateUrl: './product-details.page.html',
   styleUrls: [
   './styles/product-details.page.scss',
   './styles/product-details.shell.scss',
   './styles/product-details.ios.scss',
   './styles/product-details.md.scss'
   ]
})
export class ProductDetailsPage implements OnInit {
   @ViewChild('slides') slides: IonSlides;
   @ViewChild(IonContent, { static: true }) content: IonContent;
   subscriptions: Subscription;

   details: ProductDetailsModel;
   colorVariants = [];
   sizeVariants = [];
   productId = '';
   title = '';
   productName = '';
   productDetails = [];
   MRP = "";
   shareDetails: any = [];
   images = [];
   favouritesFlage = false;
   SKUCode = ""
   pdf_link: any;
   brochures: any;
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
 slidesOptions: any = {
      zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
 }
};

currentImageIndex: any;

categoryName = '';
product_detail: any;
reasonsToBuyFlage = false;
reasonsToBuyImageArray = []
uspList = [];
showPopup: boolean = false;
USPDescription: any;
USPTitle: any;

btnCompareText: any;

showComparePopup: boolean = false;
product_listing = [];
noRecords: number;
selectedIDs = [];
flagSameCategory: boolean = false;

@HostBinding('class.is-shell') get isShell() {
 return (this.details && this.details.isShell) ? true : false;
}

constructor(
 private route: ActivatedRoute,
 public alertController: AlertController,
 private http: HttpClient,
 private downloader: Downloader,
 private storage: Storage, private androidPermissions: AndroidPermissions,
 public loadingController: LoadingController,
 private socialSharing: SocialSharing,
 private toastCtrl: ToastController,
 public myapp: AppComponent,
 public categoriesPage: CategoriesPage,
 private platform: Platform,
 private firebaseAnalytics: FirebaseAnalytics,
 private inAppBrowser: InAppBrowser,
 public modalCtrl: ModalController,
 private router: Router
 ) {
 this.productId = this.route.snapshot.params.productId
console.log(this.route.snapshot.params);
 this.route.queryParams.subscribe(params => {
    this.categoryName = params.title;
    this.shareDetails = params;
    if (params && params.title) {
       this.title = params.title
       let param = {};
       if (params.title == "Air Conditioners") {
          param = { air_conditioner: this.productId }
     } else if (params.title == "Air Coolers") {
          param = { air_cooler: this.productId }
     } else if (params.title == "Air Purifiers"){
          param = { air_purifier: this.productId }
     } else if (params.title == "Water Purifiers") {
          param = { water_purifier: this.productId }
     } else if (params.title == "Deep Freezer") {
          param = { deep_freezer: this.productId }
     } else if (params.title == "Bottled Water Dispenser") {
          param = { water_dispenser: this.productId }
     } else if (params.title == "Visi Cooler") {
          param = { visi_cooler: this.productId }
     }
     console.log(param);
     console.log(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_details', param);
     this.loadingController.create({
          message: 'Please wait',
     }).then((res) => {
          res.present();
          if (navigator.onLine) {
             this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_details', param).subscribe((response) => {
                Object.keys(response).map(key => {
                   this.product_detail = response[key].product_details;
                   this.setData(response[key].product_details);
                   this.getPdfLink();
                   res.dismiss();
              })
           }, err => {
                res.dismiss();
                this.presentToastInternert("No internet connection. Please try again later.")
                console.log("err.........", JSON.stringify(err))
           });
        } else {
             res.dismiss();
             this.presentToastInternert("No internet connection. Please try again later.")
        }
   });
}
})
}

ngOnInit(): void { }

ionViewWillLeave(): void { }

ionViewWillEnter(): void{
 this.getComapreProductList();
    //  console.log("item", this.item);
    //  console.log("ionViewWillEnter productId", this.productId);
    let data = []
    // this.storage.get('compareList').then((val) => {
    //   console.log("compareList", val);
    //   if (val.length != 0) {
    //     data = val;
    //     for (let index in data) {
    //       if (data[index].ID == this.productId) {
    //        console.log("Already added to compare");
    //        this.btnCompareText = "Go to Compare";
    //       }else {
    //         console.log("add to compare");
    //         this.btnCompareText = "Add to Compare";
    //        }
    //     }  
    //   } else{
    //     console.log("no compareList here");
    //     this.btnCompareText = "Add to Compare";
    //   }
    // });
}

getIndex() {
 this.slides.getActiveIndex().then((index: number) => {
    console.log("index", index);
    this.currentImageIndex = index;
});
}

formatNumber(number) {
 return new Intl.NumberFormat('en-IN').format(number);
}

getPdfLink() {
 this.route.queryParams.subscribe(params => {
    this.shareDetails = params;
    if (params && params.title) {
       this.title = params.title
       let param = {};
       if (params.title == "Air Conditioners") {
          param = { air_conditioner: this.productId }
     } else if (params.title == "Air Coolers") {
          param = { air_cooler: this.productId }
     } else if (params.title == "Air Purifiers") {
          param = { air_purifier: this.productId }
     } else if (params.title == "Water Purifiers") {
          param = { water_purifier: this.productId }
     } else if (params.title == "Deep Freezer") {
          param = { deep_freezer: this.productId }
     } else if (params.title == "Bottled Water Dispenser") {
          param = { water_dispenser: this.productId }
     } else if (params.title == "Visi Cooler") {
          param = { visi_cooler: this.productId }
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
})
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
    if(value.usp)
      this.uspList = value.usp;
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
}

clickOnFavourites() {
 if (this.title == "Air Conditioners") {
    this.storeDataInAirConditioner(this.item)
} else if (this.title == "Air Coolers") {
    this.storeDataInAirCooler(this.item)
} else if (this.title == "Air Purifiers") {
    this.storeDataInAirPurifier(this.item)
} else if (this.title == "Water Purifiers") {
    this.storeDataInWaterConditioner(this.item)
} else if (this.title == "Deep Freezer") {
    this.storeDataInDeepFreezer(this.item)
} else if (this.title == "Bottled Water Dispenser") {
    this.storeDataInBottledWaterDispenser(this.item)
} else if (this.title == "Visi Cooler") {
    this.storeDataInVisiCooler(this.item)
}

let data = []
let item = this.item
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
        this.favouritesFlage = true
        data.push(item)
        this.storage.set('favouriteList', data);
   } else {
            //remove product from Favourites list
            this.favouritesFlage = false
            data.splice(removeItemIndex, 1)
            this.storage.set('favouriteList', data);
       }
  } else {
     this.favouritesFlage = true
     data.push(item)
     this.storage.set('favouriteList', data);
}
} else {
  this.favouritesFlage = true
  data.push(item)
  this.storage.set('favouriteList', data);
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

indicatorDownload() {
 let url = '';
 if (this.brochures == "") {
    url = this.pdf_link
} else {
    url = this.brochures
}
var request: DownloadRequest = {
    uri: url,
    title: 'Blue Star',
    description: '',
    mimeType: 'application/pdf',
    visibleInDownloadsUi: true,
    notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
    destinationInExternalPublicDir: {
       dirType: 'Download',
       subPath: this.item.SKUCode + '.pdf'
  }
};
if (this.platform.is("ios")) {
    const browser = this.inAppBrowser.create(url);
    this.firebaseAnalytics.logEvent('downloads_products', { product: this.SKUCode, category: this.title })
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));
} else {
    this.loadingController.create({
       message: 'Please wait while downloading',
  }).then((res) => {
       res.present();
       this.downloader.download(request)
       .then((location: string) => {
        res.dismiss()
        this.presentToast("Downloaded in device download folder")
        this.firebaseAnalytics.logEvent('downloads_products', { product: this.SKUCode, category: this.title })
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
   })
       .catch((error: any) => {
        res.dismiss();
        console.error(error)
   });
  })
}
}

addToCompare() {
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
                  // this.openpopupcomparesamecategory();
                  this.flagSameCategory = true;
                  this.showCompareLimitPopup();
             }
        }
   })
        } else {
            // show popup limit
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
        this.btnCompareText = "Go to Compare";
        console.log("Push 1");
   }
} else {
     data.push(item)
     this.storage.set('compareList', data);
     this.btnCompareText = "Go to Compare";
     console.log("Push 2")
     this.storage.get('compareList').then((val) => {
        console.log("compareList", val);
   });
}
} else {
  data.push(item)
  this.storage.set('compareList', data);
  this.btnCompareText = "Go to Compare";
  console.log("Push 3");
}
});
 this.storage.set('categaryTitle', this.title);
}

async alertAddComapreProduct() {
 const alert = await this.alertController.create({
      // header: "Confirmation",
      header: "Are you sure you want to add compare product?",
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
        this.addToCompareDataInLocalStorage(this.item)
        alert.dismiss();
   }
}
]
});

 await alert.present();
}

async showAlertErrorAdd() {
 const alert = await this.alertController.create({
      // header: "Confirmation",
      header: "Only 3 Product added in compare list",
      // message: "Are you sure you'd like to remove this product from My Products?",
      cssClass: 'variant-alert size-chooser',
      buttons: [
        // {
        //   text: 'Cancel',
        //   role: 'cancel',
        //   cssClass: 'secondary',
        //   handler: () => {
        //     alert.dismiss();
        //   }
        // }, 
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

async showAlertErrorLimit() {
 const alert = await this.alertController.create({
      // header: "Confirmation",
      header: "Please add the product of the same category for comparison",
      // message: "Are you sure you'd like to remove this product from My Products?",
      cssClass: 'variant-alert size-chooser',
      buttons: [
        // {
        //   text: 'Cancel',
        //   role: 'cancel',
        //   cssClass: 'secondary',
        //   handler: () => {
        //     alert.dismiss();
        //   }
        // }, 
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

async showAlertErrorAlreadyAdd() {


 let navigationExtras: NavigationExtras = {
    queryParams: {
       title: this.categoryName,
  }
};
this.router.navigate(['compare/'], navigationExtras);

    // const alert = await this.alertController.create({
    //   header: "Product already added to compare list",
    //   cssClass: 'variant-alert size-chooser',
    //   buttons: [ 
    //     {
    //       text: 'OK',
    //       handler: () => {
    //         alert.dismiss();
    //       }
    //     }
    //   ]
    // });
    // await alert.present();
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

async presentToastInternert(msg) {
 const toast = await this.toastCtrl.create({
    message: msg,
    duration: 8000,
    position: 'bottom',
    cssClass: "msg-align",
});
 toast.present();
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

async shareMethod() {
 await this.toDataUrl(this.item.Image, this, function (myBase64, _this) {
    _this.callMethod(myBase64)
});
}

callMethod(myBase64) {
 let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
    this.title
}\nProduct Title: ${this.item.ProductTitle}\nSKU Code: ${
    this.item.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    this.socialSharing.share(body, this.item.ProductTitle.replace(/\%/g, " pc"), myBase64, null)
    .then(sucess => {
       this.firebaseAnalytics.logEvent('share_products', { product: this.item.SKUCode, category: this.title })
       .then((res: any) => console.log(res))
       .catch((error: any) => console.error(error));
  })
    .catch(err => {
       console.log(err);
  });
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
        // this.openModel();
        this.showCompareLimitPopup();
   }
})
}

async openModel() {
 const modal = await this.modalCtrl.create({
    component: PopupCompare,
    componentProps: {},
    cssClass:"my-modal",
    backdropDismiss:false
});
 return await modal.present();
}

async openpopupcomparesamecategory() {
 const modal = await this.modalCtrl.create({
    component: popupcomparesamecategory,
    componentProps: {},
    cssClass:"my-modal",
    backdropDismiss:false
});
 return await modal.present();
}

openpopup(item) {
 let data = []
 this.storage.get('compareList').then((val) => {
    data = val;
    let count = 0;
    for (let index in data) {
       if (data[index].ID == item.ID) {
          count = 1;
          // console.log("if****");
          this.showAlertErrorAlreadyAdd();
     }
}
if (count == 0) {
        // console.log("enter count 0");
        // this.openModel();
        // this.alertAddComapreProduct();
        this.addToCompareDataInLocalStorage(this.item)
   }
})
}

  // async openZoomPopup(images) {
  //   const modal = await this.modalCtrl.create({
  //     component: ZoomPopup,
  //     componentProps: {images: images}
  //   });
  //   return await modal.present();
  // }

  openZoomPopup(images) {
      let navigationExtras: NavigationExtras = {
         queryParams: {
            images: images,
            currentImageIndex: this.currentImageIndex
       }
  };
  this.router.navigate(['zoom'], navigationExtras);
}

async openPopupReasonToBuy(item) {
 const modal = await this.modalCtrl.create({
    component: PopupReasonToBuy,
    componentProps: {
       item: item
  }
});
 return await modal.present();
}

  // pressShowPopup(item){
  //   setTimeout(() => {
  //    this.openPopupReasonToBuy(item);
  //   }, 1000);
  // }

  close() {
      this.showPopup = false;
 }

 showUSPPopup(item){
      this.showPopup = true;
      this.USPTitle = item[0];
      this.USPDescription = item[1];
      this.content.scrollToPoint(0, 0, 1000);
 }

 showComparePage() {
      let navigationExtras: NavigationExtras = {
         queryParams: {
            title: this.categoryName,
       }
  };
  this.router.navigate(['compare/'], navigationExtras);
}

  // ******* showCompareLimitPopup *********

  showCompareLimitPopup(){
      this.showComparePopup = true;
    // this.content.scrollToPoint(0, 0, 1000);
}

closeComparePopup(){
 this.showComparePopup = false;

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
}

getComapreProductList() {
 this.loadingController.create({
    message: 'Please wait',
}).then((res) => {
    res.present();
    this.storage.get('compareList').then((val) => {
       res.dismiss();
       if (val != null) {
          this.product_listing = val;
          this.noRecords = this.product_listing.length;
          // console.log("product_listing", this.product_listing);
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

removeProductFromCompareList() {
 let data = []
 this.storage.get('compareList').then((val) => {
    if (val != null) {
       if (val.length != 0) {
          data = val;
          var newArr = [];
          for (let index in data) {
             let index_of_id = this.selectedIDs.indexOf(data[index].ID);
             if (index_of_id > -1) {
                data[index] = null;
           } else {
                newArr.push(data[index]);
           }
      }
      console.log(newArr);
      this.product_listing = newArr;
      this.storage.set('compareList', newArr);
      this.getComapreProductList();
 }
}
});
}

}
