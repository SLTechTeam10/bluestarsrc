import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AppComponent } from "./../app.component";
import { HttpClient } from '@angular/common/http';
import { CategoriesPage } from "./../categories/categories.page";

@Component({
  selector: 'app-categories',
  templateUrl: './notifications.page.html',
  styleUrls: [
    './styles/notifications.page.scss',
    './styles/notifications.shell.scss',
    './styles/notifications.responsive.scss'
  ]
})
export class NotificationsPage implements OnInit {
  
  notification_listing = [];
  countNotification: any;
  refreshId: any;

  constructor(private storage: Storage, public alertController: AlertController, 
    private router: Router, public loadingController: LoadingController,
    public myapp: AppComponent, private http: HttpClient, private categoriesPage: CategoriesPage,
    private toastCtrl: ToastController) {
 
  }
  
  ngOnInit(): void {}

  ionViewWillEnter(){
    this.getNotificationList();

    // this.refreshId = setInterval(() => {
    //   this.refreshNotificationList();
    // }, 2000);
  }

  // ionViewDidLeave() {
  //   //Stop refresh
  //   clearInterval(this.refreshId);
  // }

  doRefresh(event) {
    setTimeout(() => {
      this.refreshNotificationList();
      event.target.complete();
    }, 2000);
  }

  getNotificationList() {
    console.log("Enter getNotificationList");
    this.loadingController.create({
      message: 'Please wait',
    }).then((res) => {
      res.present();
      if (navigator.onLine) {
        this.storage.get('notificationList').then((val) => {
          this.notification_listing = val;
          // console.log("notificationList", val);
         if(this.notification_listing){
          this.notification_listing.sort(function(a, b){return b.ID - a.ID});
          this.countNotification = this.notification_listing.length;
          console.log("sort", this.notification_listing);
          // console.log("countNotification", this.countNotification);
         }
        })
        res.dismiss();
      } else {
        res.dismiss();
        console.log("no internat connection")
      }
    });
  }

  showNotificationsViewPage(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.router.navigate(['notifications-view'], navigationExtras);
    let data = []
    this.storage.get('notificationList').then((val) => {
    if (val != null) {
      if (val.length != 0) {
        data = val;
        for (let index in data) {
          if (data[index].ID == id) {
            data[index].status = "read";

            this.storage.set('notificationList', data);
          }

        }
      }
    }
    })
  }

  refreshNotificationList(){
    console.log("Eneter refreshNotificationList");
    // this.loadingController.create({
    //   message: 'Please wait',
    // }).then((res) => {
    //   res.present();
    if (navigator.onLine) {
      this.http.get(this.categoriesPage.apiBaseUrl + '/bluestar_api/notification_list').subscribe((response) => {
        Object.keys(response).map(key => {
          this.notification_listing = response[key].notification_listing;
          // console.log("notification_listing", this.notification_listing);
          let data = []
          this.storage.get('notificationList').then((val) => {
            // console.log("local storage notificationList", val);
           if(val == null){
            this.storage.set('notificationList', this.notification_listing);
            this.countNotification = this.notification_listing.length;
            // console.log("countNotification", this.countNotification);
           }else{
             for(let i in this.notification_listing){
              data = val;
              let count = 0;
              for (let index in data) {
                if (data[index].ID == this.notification_listing[i].ID) {
                  count = 1;
                 
                }
              }
              if(count == 0){
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
                     if(data[index].status != 'read'){
                        count++;
                     }
                  }else{
                    count++;
                  }
                }
                this.countNotification = count;
                this.removeNotification();
                // console.log("countNotification****", this.countNotification);
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
    console.log("Eneter removeNotification");
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
            for(let i in this.notification_listing){
              // console.log("*****", data[index]);
              // console.log("notification_listing", this.notification_listing[i]);
              if (data[index].ID == this.notification_listing[i].ID) {
                count = 1;
                removeItemIndex = Number(index);
                position.push(removeItemIndex);
              }
            }
           }
           for(let j in position){
                 newArr.push(data[position[j]])
           }
           this.storage.set('notificationList', newArr);
          //  console.log("newArr", newArr);
        }else{
          this.storage.set('notificationList', []);
        }
      }
    });

    this.getNotificationList();
    // this.getNotificationListNoLoader();
  }

  getNotificationListNoLoader() {
    console.log("Enter getNotificationList");
    // this.loadingController.create({
    //   message: 'Please wait',
    // }).then((res) => {
      // res.present();
      if (navigator.onLine) {
        this.storage.get('notificationList').then((val) => {
          this.notification_listing = val;
          // console.log("notificationList", val);
         if(this.notification_listing){
          this.notification_listing.sort(function(a, b){return b.ID - a.ID});
          console.log("sort No Laoder", this.notification_listing);
         }
        })
        // res.dismiss();
      } else {
        // res.dismiss();
        console.log("no internat connection")
      }
    // });
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
