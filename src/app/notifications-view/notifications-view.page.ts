import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AppComponent } from "./../app.component";
import { HttpClient } from '@angular/common/http';
import { CategoriesPage } from "./../categories/categories.page";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-categories',
  templateUrl: './notifications-view.page.html',
  styleUrls: [
    './styles/notifications-view.page.scss',
    './styles/notifications-view.shell.scss',
    './styles/notifications-view.responsive.scss'
  ]
})
export class NotificationsViewPage implements OnInit {

  id: any;
  notification_details: any;
  data: any;

  constructor(private storage: Storage, public alertController: AlertController,
    private router: Router, public loadingController: LoadingController, private route: ActivatedRoute,
    public myapp: AppComponent, private http: HttpClient, private toastCtrl: ToastController,
    private categoriesPage: CategoriesPage, private sanitizer: DomSanitizer,
    private iab: InAppBrowser) {

    this.getNotificationDetail();
  }


  ngOnInit(): void { }

  getNotificationDetail() {
    this.route.queryParams.subscribe(params => {
      this.id = params.id
      let param = {};
      if (this.id) {
        // console.log("Enter if*****");
        let data = []
        this.storage.get('notificationList').then((val) => {
          if (val != null) {
            if (val.length != 0) {
              data = val;
              for (let index in data) {
                if (data[index].ID == this.id) {
                  data[index].status = "read";
                  this.storage.set('notificationList', data);
                }

              }
            }
          }
        })
      }
      param = { notification_id: this.id }
      this.loadingController.create({
        message: 'Please wait',
      }).then((res) => {
        res.present();
        if (navigator.onLine) {
          this.http.post(this.categoriesPage.apiBaseUrl + '/bluestar_api/view_notification', param).subscribe((response) => {
            Object.keys(response).map(key => {
              this.notification_details = response[key].notification_details;
              console.log("notification_details", this.notification_details);
              this.data = this.notification_details.LongDescription;
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
    })
  }

  openPDFLink(link: any) {
    this.iab.create(link);
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
