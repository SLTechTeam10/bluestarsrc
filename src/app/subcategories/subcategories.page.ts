import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-subcategories',
  templateUrl: './subcategories.page.html',
  styleUrls: [
    './styles/categories.page.scss',
    './styles/categories.shell.scss',
    './styles/categories.responsive.scss'
  ]
})
export class SubcategoriesPage {

    // apiBaseUrl = "https://damuat.iksulalive.com";

  // apiBaseUrl = "https://damstage.iksulalive.com";

  apiBaseUrl = "https://dams.bluestarindia.com"  // production url

  notification_listing = [];
  countNotification: any;
  refreshId: any;

  constructor(private http: HttpClient, private router: Router,
    private storage: Storage, private platform: Platform) {


    // platform.ready().then(() => {

    //   if (platform.is('cordova')) {
    //     //Subscribe on pause i.e. background
    //     this.platform.pause.subscribe(() => {
    //       //Hello pause
    //       console.log("Handle event on pause");
    //       this.getNotificationList();
    //     });

    //     //Subscribe on resume i.e. foreground 
    //     this.platform.resume.subscribe(() => {
    //       this.getNotificationList();
    //       window['paused'] = 0;
    //       console.log("Handle event on resume");
    //     });
    //   }
    // });
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.getNotificationList();
    // // this.storage.clear();
    // this.refreshId = setInterval(() => {
    //   this.getNotificationList();
    // }, 2000);
  }

  // ionViewDidLeave() {
    //Stop refresh
    // clearInterval(this.refreshId);
  // }

  doRefresh(event) {
    setTimeout(() => {
      this.getNotificationList();
      event.target.complete();
    }, 2000);
  }

  goToProductListPage(text) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        title: text
      }
    };
    this.router.navigate(['product'], navigationExtras);
  }

  getNotificationList() {
    // console.log("Enter getNotificationList");
    // this.loadingController.create({
    //   message: 'Please wait',
    // }).then((res) => {
    //   res.present();
    if (navigator.onLine) {
      this.http.get(this.apiBaseUrl + '/bluestar_api/notification_list').subscribe((response) => {
        Object.keys(response).map(key => {
          this.notification_listing = response[key].notification_listing;
          //console.log("notification_listing", this.notification_listing);
          let data = [];
          this.storage.get('notificationList').then((val) => {
            // console.log("local storage notificationList", val);
            if (val == null) {
              if (this.notification_listing) {
                this.storage.set('notificationList', this.notification_listing);
                this.countNotification = this.notification_listing.length;
              } else {
                this.storage.set('notificationList', []);
                this.countNotification = 0;
              }
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




}
