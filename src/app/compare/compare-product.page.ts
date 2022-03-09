import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { CompareProductModel } from './compare-produc.model';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LoadingController, ModalController, AlertController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-compare-product',
  templateUrl: './compare-product.page.html',
  styleUrls: [
    './styles/compare-product.page.scss',
    './styles/compare-product.shell.scss'
  ]
})
export class CompareProductPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  subscriptions: Subscription;

  listing: CompareProductModel;
  title = '';
  product_listing = [];
  productTitle = [];
  checkLenght: any;
  noRecords: number;
  sorted_products: any;
  titleProduct: any;
  defoultList: any;
  showDifferenceFlage = false;

  selectedTitle = ""
  uspList = [];
  showPopup: boolean = false;
  USPDescription: any;
  USPTitle: any;

  categoryName: any;

  fixPRODUCTSPECIFICATIONS = [
    "Model/Series Name",
    "Product Name",
    "MRP(Rs)",
    "Purification Technology",
    "Output Water Type",
    "Storage capacity (Litres)",
    "Filter Type",
    "Installation type (Wall Mount/Counter Top /Under the Counter)",
    "Product Colour",
    "Recommended For (Source of water)",
    "Total Dissolved Solids (TDS) Levels (ppm)",
    "Indications",
    "Product Warranty (Months)",
    "Features"
  ]

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,
    public loadingController: LoadingController, public alertController: AlertController,
    public modalCtrl: ModalController, private storage: Storage,
    private inAppBrowser: InAppBrowser) {

    this.route.queryParams.subscribe(params => {
      this.categoryName = params.title;
      // console.log("categoryName", this.categoryName);
    });
  }

  ngOnInit(): void {

  }

  ionViewWillEnter() {
    this.getComapreProductList();
  }

  formatNumber(number) {
    return new Intl.NumberFormat('en-IN').format(number);
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

          var new_arr = [];
          for (var i = 0; i < this.product_listing.length; i++) {
            for (var j = 0; j < this.product_listing[i].productSpecifications.length; j++) {
              new_arr.push(this.product_listing[i].productSpecifications[j]);
            }
          }

          let result = Object.values(new_arr.reduce((a, { title, ...props }) => {
            if (!a[title])
              a[title] = Object.assign({}, { title, data: [props] });
            else
              a[title].data.push(props);
            return a;
          }, {}));
          this.sorted_products = result;
          this.defoultList = result;

          // console.log("sorted_products", this.sorted_products);
          // Remove "-" from compare table
          let this2 = this;
          this.sorted_products = this.sorted_products.filter(f => {
            return this2.checkCount(f);
          })
          // console.log("sorted_products", this.sorted_products);
          console.log("product_listing", this.product_listing);
          this.noRecords = this.product_listing.length;
        } else {
          this.noRecords = 0;
        }
      }, err => {
        console.log("err.........", err)
        res.dismiss();
      });
    });
  }

  checkCount(f) {
    var abcd = 1;
    f.data.forEach(element => {
      abcd += element.value == "-" ? 1 : 0;
    });
    return abcd <= f.data.length;
    // if(this.categoryName == 'Water Purifiers'){
    //   console.log("Enter if");
    //   return abcd < f.data.length && this.fixPRODUCTSPECIFICATIONS.includes(f.title);
    // }else{
    //   console.log("Enter else");
    //   return abcd < f.data.length;
    // }
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
            this.product_listing = data;
            this.storage.set('compareList', data);
            this.getComapreProductList();
          }
        }
      }
    });
  }

  showDifferenceOnly(flage) {
    this.showDifferenceFlage = flage;
    if (flage) {
      let array = [];
      for (let i in this.defoultList) {
        let count = this.defoultList[i].data.length
        let isEqual = true
        if (count > 1) {
          for (let x = 0; x < count - 1; x++) {
            if (this.defoultList[i].data[x].value != this.defoultList[i].data[x + 1].value) {
              isEqual = false;
            }
          }
          if (!isEqual) {
            let data = {
              data: [],
              title: ""
            };
            data.data = this.defoultList[i].data
            data.title = this.defoultList[i].title
            array.push(data)
          }
        }
      }
      this.sorted_products = array;
    } else {
      this.sorted_products = this.defoultList;
    }
  }

  showDataByTitle(titleProduct) {
    this.selectedTitle = titleProduct
    this.scrollTo(titleProduct);
  }

  scrollTo(element: string) {
    let yOffset = document.getElementById(element).offsetTop;
    this.content.scrollToPoint(0, yOffset, 4000)
  }

  close() {
    this.showPopup = false;
  }

  showUSPPopup(item) {
    this.showPopup = true;
    this.USPTitle = item[0];
    this.USPDescription = item[1];
    this.content.scrollToPoint(0, 0, 1000)
  }

  goToProductListPage() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        title: this.categoryName,
        openCompareFunction: 'true'
      }
    };
    this.router.navigate(['product'], navigationExtras);
  }

  openPDF(pdf_link) {
    this.inAppBrowser.create(pdf_link);
  }
}
