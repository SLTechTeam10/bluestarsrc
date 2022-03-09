import { Component } from '@angular/core';
import { PopoverController, NavParams, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './../../app/app.component';
import { CategoriesPage } from "./../categories/categories.page";

@Component({
  selector: 'share-popover',
  templateUrl: 'share-popover.html',
})

export class SharePopover {

  getPdflink: any;
  pdf_link: any;
  shareDetails: any = [];
  title: any;
  productId: any;
  image: any;

  constructor(private popoverCtrl: PopoverController, private route: ActivatedRoute,
    private navParams: NavParams, private socialSharing: SocialSharing,
    public loadingController: LoadingController, public myapp: AppComponent,
    private categoriesPage: CategoriesPage,
    private http: HttpClient) {

    // this.pdf_link = this.navParams.get('pdf_link');
    this.shareDetails = this.navParams.get('shareDetails');
    this.title = this.navParams.get('title');
    this.productId = this.shareDetails.ID;
    console.log("Enter SharePopover******", this.shareDetails);
    console.log("id", this.productId);
    console.log("title", this.title);
    this.getPdfLink();
  }

  getPdfLink() {
    // this.route.queryParams.subscribe(params => {
    //   this.shareDetails = params;
    //   if (params && params.title) {
    //     this.title = params.title
    let param = {};
    if (this.title == "Air Conditioner") {
      param = { air_conditioner: this.productId }
    } else if (this.title == "Air Cooler") {
      param = { air_cooler: this.productId }
    } else if (this.title == "Air Purifier") {
      param = { air_purifier: this.productId }
    } else if (this.title == "Water Purifier") {
      param = { water_purifier: this.productId }
    } else if (this.title == "Deep Freezer") {
      param = { deep_freezer: this.productId }
    } else if (this.title == "Bottled Water Dispenser") {
      param = { water_dispenser: this.productId }
    } else if (this.title == "Visi Cooler") {
      param = { visi_cooler: this.productId }
    }

    console.log("param", param);
    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/product_pdf/download', param).subscribe((response) => {
          Object.keys(response).map(key => {
            this.pdf_link = response[key].pdf_link;
            console.log("pdf link", this.pdf_link);
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
    //   }
    // })
  }

  shareByWhatsup() {
    console.log("Enter shareByWhatsup");
    let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
      this.title
      }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
      this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    console.log(body);
    this.socialSharing
      .shareViaWhatsApp(body, this.image)
      .then(sucess => {
        console.log("sucess", sucess);
      })
      .catch(err => {
        console.log(err);
      });
    this.DismissClick();
  }

  shareByFacebook() {
    console.log("Enter shareByFacebook");

    let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
      this.title
      }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
      this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    console.log(body);
    this.socialSharing
      .shareViaFacebook(body, this.image, null)
      .then(sucess => {
        console.log("sucess", sucess);
      })
      .catch(err => {
        console.log(err);
      });
    this.DismissClick();
  }

  shareByEmail() {
    let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
      this.title
      }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
      this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    console.log(body);
    this.socialSharing
      .shareViaEmail(body, this.shareDetails.ProductTitle, null, null, null, this.image)
      .then(sucess => {
        console.log("sucess", sucess);
      })
      .catch(err => {
        console.log(err);
      });
    this.DismissClick();
  }

  async DismissClick() {
    await this.popoverCtrl.dismiss();
  }
}
