import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Platform,AlertController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
// import { FirebaseConfig } from '@ionic-native/firebase-config/ngx';
import { FirebaseConfig } from '@awesome-cordova-plugins/firebase-config/ngx';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: [
  './styles/categories.page.scss',
  './styles/categories.shell.scss',
  './styles/categories.responsive.scss'
  ]
})
export class CategoriesPage {
  @ViewChild(IonContent) content: IonContent;

  // apiBaseUrl = "https://damuat.iksulalive.com";

  // apiBaseUrl = "https://damstage.iksulalive.com";

  // apiBaseUrl =  "https://damstage.iksulalive.com" //testing

  apiBaseUrl = "https://dams.bluestarindia.com"  // production url

  notification_listing = [];
  countNotification: any;
  refreshId: any;

  remoteConfig: any = null;
  scroll: boolean = true;

  ionVersionNumber: string;
  ionVersionCode: string|number;

  my_platform: any;

  constructor(private http: HttpClient, private router: Router,   private appVersion: AppVersion,
   private theInAppBrowser: InAppBrowser,
   public alertController: AlertController,
   private firebaseConfig: FirebaseConfig,
   private storage: Storage, private platform: Platform) {


    platform.ready().then(() => {

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

    if (this.platform.is('android')) {
      console.log("running on Android device!");
      this.my_platform="android";
    }else if (this.platform.is('ios')){
     console.log("running on iOS device!")
     this.my_platform="ios";
   }else{
    console.log("unidentified platform");

  }
  this.Get_app_version();


});
  }

  scrollBottom() {
    this.content.scrollToBottom(400);
    this.scroll = false;
  }


  logScrolling(event) {
    console.log("my event", event.detail.scrollTop);
    if(event.detail.scrollTop == "0") {
      this.scroll = true;
    } else if (event.detail.scrollTop >= "200") {
      this.scroll = false;
    } else {
      console.log("no scroll");
    }

  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.getNotificationList();

    this.platform.resume.subscribe(() => {
      this.Get_app_version();
    });

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

  Get_app_version(){
    this.platform.ready().then(() => {
      this.appVersion.getVersionNumber().then(res => {
        this.ionVersionNumber = res;
        console.log("GET CURRENT VESION =>",res)
      }).catch(error => {
        console.log(error)
        // alert(error);
      });

      this._fetchRemoteVersion().then((result) => {
        console.log("GET FB REMOTE VERSION",result);
        this.Check_for_newversion();
      }, (err) => {
        console.log("Connection failed Messge");
      });


    })
  }

  async Check_for_newversion(){
    const check_hasNewVersion = await this.isNewVersionAvailable();
    console.log("check_hasNewVersion",check_hasNewVersion)
    if(check_hasNewVersion){
      this.hasNewVersion_Alert();
    }
  }

  private  _fetchRemoteVersion(){
    return new Promise<string>((resolve, reject) => {
      this.firebaseConfig.fetchAndActivate().then(() => {
        this.firebaseConfig.getString('version')
        .then((remoteVersion) =>{
          console.log("FETCHING AND ACTIVATE THE REMOTE VERSION ",remoteVersion)
          resolve(remoteVersion)
          this.remoteConfig = remoteVersion;
        })
        .catch(err => {
          console.log("REJECT ERROR --->",err)
          reject(err)
        });
      })
      .catch(err => {
        console.log("REJECT 2 ERROR --->",err)
        reject(err)
      });
    });
    console.log()
  }
  /**
   * Returns true if remote version is newer than current version
   *
   * @param remoteVersion Version from remote config
   * @param currentVersion Current version
   */
   private _isVersionNewer(remoteVersion: string, currentVersion: string): boolean {

    const remoteVersionArr = remoteVersion.split('.');
    const currentVersionArr = currentVersion.split('.');
    for (let i = 0; i < remoteVersionArr.length; i++){
      const r = Number(remoteVersionArr[i]) || 0;
      const c = Number(currentVersionArr[i]) || 0;
      if (r > c) {
        return true;
      }
      if (r < c) {
        return false;
      }
    }
    return false;
  }

  async isNewVersionAvailable(){
    if (this.remoteConfig) {
      const currentVersion = this.ionVersionNumber || '0.0.0';
      const remoteVersion = await this._fetchRemoteVersion() || '0.0.0';
      console.log("currentVersion VERSION",currentVersion);
      console.log("REMOTE VERSION",remoteVersion);
      if (this._isVersionNewer(remoteVersion, currentVersion)) {
        return true;
      }

      return false;
    }
    return false;
  }



  async hasNewVersion_Alert (){
    const alert = await this.alertController.create({
      header: 'Update Available',
      message: 'An updated version of this app is available',
      cssClass: 'appupdate-css-class',
      backdropDismiss: false,
      buttons: [{
        text: 'Update Now',
        handler: async () => {
          let target = "_system";
          console.log("MY PLATFORM -->",this.my_platform)
          if (this.my_platform === 'ios'){
            this.theInAppBrowser.create('https://apps.apple.com/in/app/star-catalogue/id1520352873',target);
          } else if (this.my_platform === 'android'){
            this.theInAppBrowser.create('https://play.google.com/store/apps/details?id=com.bluestarindia.starcatalogue',target);
            navigator['app'].exitApp();
          }
        }
      }
      ]
    });
    await alert.present();
  }


}

