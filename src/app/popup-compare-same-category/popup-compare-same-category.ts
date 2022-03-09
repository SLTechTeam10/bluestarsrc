import { Component } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'popup-compare-same-category',
  templateUrl: 'popup-compare-same-category.html',
  styleUrls: ['./popup-compare-same-category.scss']
})

export class popupcomparesamecategory {

  product_listing = [];
  noRecords: number;
  selectedIDs = [];
  title: any;

  constructor(public modalCtrl: ModalController, private route: ActivatedRoute,
    private navParams: NavParams, public loadingController: LoadingController,
    private storage: Storage, public alertController: AlertController) {

    this.title = this.navParams.get('title');
    this.getComapreProductList();
    console.log("title popupcomparesamecategory", this.title);
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

          //  Popup height start
          var getCss = document.querySelector('ion-modal');
          console.log("getCss", getCss, this.product_listing.length);
          switch (this.product_listing.length) {
            case 1:
              getCss.style.height = "40%";
              break;

            case 2:
              getCss.style.height = "60%";
              break;

            case 3:
              getCss.style.height = "80%";
              break;

            default:
              getCss.style.height = "40%";
              break;
          }
          //  Popup height ent

        }
      }, err => {
        console.log("err.........", err)
        res.dismiss();
      });
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  AddIds(id) {
    let index_of_id = this.selectedIDs.indexOf(id);
    if (index_of_id < 0) {
      this.selectedIDs.push(id);
    } else {
      this.selectedIDs.splice(index_of_id, 1);
    }
  }

  async showAlertRemoveProduct() {

    if (this.selectedIDs.length == 0) {
      this.showAlertError();
    } else {
      const alert = await this.alertController.create({
        // header: "Confirmation",
        header: "Are you sure you want to remove product in compare product?",
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
              this.removeProductFromCompareList();
              alert.dismiss();
            }
          }
        ]
      });

      await alert.present();
    }

  }

  removeProductFromCompareList() {


    // var getCss = document.querySelector('ion-modal');
    // console.log("getCss", getCss, this.product_listing.length);
    // switch (this.product_listing.length-1) {
    //   case 1:
    //     getCss.style.height = "40%";
    //     break;

    //   case 2:
    //     getCss.style.height = "60%";
    //     break;

    //   case 3:
    //     getCss.style.height = "80%";
    //     break;

    //   default:
    //     getCss.style.height = "40%";
    //     break;
    // }

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

  async showAlertError() {
    const alert = await this.alertController.create({
      // header: "Confirmation",
      header: "Please select atleast one product to remove from compare",
      // message: "Are you sure you'd like to remove this product from My Products?",
      cssClass: 'variant-alert',
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
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

}
