import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../utils/resolver-helper';
import { ProductCatalogueModel } from './product-catalogue.model';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
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
  selector: 'app-product-catalogue',
  templateUrl: './product-catalogue.page.html',
  styleUrls: [
    './styles/product-catalogue.page.scss',
    './styles/product-catalogue.shell.scss'
  ]
})
export class ProductCataloguetPage implements OnInit {

  product_leaflet = [];
  noRecords: number;
  // pdf_link: any;
  listing: ProductCatalogueModel;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,
    public loadingController: LoadingController, public modalCtrl: ModalController,
    private storage: Storage, public myapp: AppComponent, private downloader: Downloader,
    private toastCtrl: ToastController, private platform: Platform,
    private firebaseAnalytics: FirebaseAnalytics, private inAppBrowser: InAppBrowser, private categoriesPage: CategoriesPage,
    private socialSharing: SocialSharing) {

    this.getproductLeaflet();
  }


  ngOnInit(): void { }

  getproductLeaflet() {
    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.http.get(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_leaflet').subscribe((response) => {
          Object.keys(response).map(key => {
            console.log("response[key]", response[key]);
            res.dismiss();

              this.product_leaflet = response[key].product_leaflet;
              if(this.product_leaflet){
                console.log("product_leaflet", this.product_leaflet);
                this.noRecords = this.product_leaflet.length;
                console.log("noRecords if", this.noRecords);
              }else{
                this.noRecords = 0;
                console.log("noRecords else", this.noRecords);
              }
          })
        }, err => {
          res.dismiss();
          this.presentToastInternert("No internet connection. Please try again later.");
        });
      } else {
        res.dismiss();
        this.presentToastInternert("No internet connection. Please try again later.");
      }
    });
  }

  downloadPDF(name,pdflink) {
    console.log("pdf_link", pdflink);
    console.log("category", name);

    var request: DownloadRequest = {
      uri: pdflink,
      title: 'Blue Star',
      description: '',
      mimeType: 'application/pdf',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalPublicDir: {
        dirType: 'Download',
        subPath: name + '.pdf'
      }
    };
    console.log("request", request);
    if (this.platform.is("ios")) {
      const browser = this.inAppBrowser.create(pdflink);
      this.firebaseAnalytics.logEvent('downloads_products', { category: name })
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
            this.firebaseAnalytics.logEvent('downloads_products', { category: name })
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

  async presentToastInternert(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 8000,
      position: 'bottom',
      cssClass: "msg-align",
    });
    toast.present();
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
}
