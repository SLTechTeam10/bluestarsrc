import { Component } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

@Component({
  selector: 'popover-page',
  templateUrl: 'popover.html',
})

export class Popover {

  getPdflink: any;
  pdf_link: any;
  shareDetails: any = [];
  categary: any;
  image: "";

  constructor(private popoverCtrl: PopoverController, private route: ActivatedRoute,
    private navParams: NavParams, private socialSharing: SocialSharing,
    private firebaseAnalytics: FirebaseAnalytics) {

    this.pdf_link = this.navParams.get('pdf_link');
    this.shareDetails = this.navParams.get('shareDetails');
    this.categary = this.navParams.get('title');
  
    console.log("******", JSON.stringify(this.shareDetails));

  }


  async shareByWhatsup() {
    // this.toDataUrl(this.shareDetails.Image, function (myBase64) {
    //   console.log(myBase64); // myBase64 is the base64 string
    //   console.log("in then...................")
    //   let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
    //     this.categary
    //     }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
    //     this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    //   this.socialSharing.share(body, this.shareDetails.ProductTitle, myBase64, null)
    //     .then(sucess => {
    //       console.log("sucess", sucess);
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // });

    // this.socialSharing
    //   .shareViaWhatsApp(body, this.image)
    //   .then(sucess => {
    //     console.log("sucess", sucess);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    //this.shareFirebaseAnalitys()
    this.DismissClick();
  }

  // async shareByFacebook() {
  //   console.log("Enter shareByFacebook");

  //   await this.toDataUrl(this.shareDetails.Image, function (myBase64) {
  //     console.log(myBase64); // myBase64 is the base64 string
  //     console.log("in then...................")
  //     this.callMethod(myBase64)
  //   });

  //   console.log("after await...........")

  //   // let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
  //   //   this.categary
  //   //   }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
  //   //   this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
  //   // console.log(body);
  //   // this.socialSharing
  //   //   .shareViaFacebook(body, this.image, null)
  //   //   .then(sucess => {
  //   //     console.log("sucess", sucess);
  //   //   })
  //   //   .catch(err => {
  //   //     console.log(err);
  //   //   });

  //   //this.shareFirebaseAnalitys()
  //   //this.DismissClick();
  // }

  callMethod(myBase64) {
    console.log("in callMethod...........")
    let body = `Hi there, check out this product by Blue Star!\n\nProduct Category: ${
      this.categary
      }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
      this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    this.socialSharing.share(body, this.shareDetails.ProductTitle, myBase64, this.pdf_link)
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
      this.categary
      }\nProduct Title: ${this.shareDetails.ProductTitle}\nSKU Code: ${
      this.shareDetails.SKUCode}\nClick here to get the product specification: ${this.pdf_link.replace(/\s/g, "%20")}`;
    console.log(body);
    // this.socialSharing
    //   .shareViaEmail(body, this.shareDetails.ProductTitle, null, null, null, this.image)
    //   .then(sucess => {
    //     console.log("sucess", sucess);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    this.socialSharing.share(body, this.shareDetails.ProductTitle, this.shareDetails.Image, null)
      .then(sucess => {
        console.log("sucess", sucess);
      })
      .catch(err => {
        console.log(err);
      });

    //this.shareFirebaseAnalitys()
    this.DismissClick();
  }

  async DismissClick() {
    await this.popoverCtrl.dismiss();
  }

  shareFirebaseAnalitys() {
    this.firebaseAnalytics.logEvent('share_products', { product: this.shareDetails.SKUCode, category: this.categary })
      .then((res: any) => console.log(res))
      .catch((error: any) => console.error(error));
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
  async shareByFacebook() {
    await this.toDataUrl(this.shareDetails.Image, this, function (myBase64, _this) {
      console.log(myBase64); // myBase64 is the base64 string
      _this.callMethod(myBase64)
    });
  }
}
