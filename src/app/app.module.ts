import { NgModule } from '@angular/core'; 
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Popover } from '../../src/app/popover/popover';
import { Network } from '@ionic-native/network/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { Downloader } from '@ionic-native/downloader/ngx';
import { SharePopover } from '../../src/app/share-popover/share-popover';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CategoriesPage } from './categories/categories.page';
import { PopupCompare } from './popup-compare/popup-compare';
import { popupcomparesamecategory } from './popup-compare-same-category/popup-compare-same-category';
import { PopupReasonToBuy } from './popup-reason-to-buy/popup-reason-to-buy';
import { Push } from '@ionic-native/push/ngx';

// import { FirebaseConfig } from '@ionic-native/firebase-config/ngx';
import { FirebaseConfig } from '@awesome-cordova-plugins/firebase-config/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

// import { PushProvider } from '../providers/push/push';

import { from } from 'rxjs';

@NgModule({
  declarations: [AppComponent, Popover, SharePopover, PopupCompare, PopupReasonToBuy, popupcomparesamecategory],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    SQLite,
    AppComponent,
    CategoriesPage,
    SocialSharing,
    FileTransfer,
    FileTransferObject,
         AppVersion,
             FirebaseConfig,
    Network,
    CallNumber,
    FirebaseAnalytics,
    File,
    Downloader,
    InAppBrowser,
    AndroidPermissions,
    Push,
    // PushProvider,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
  entryComponents: [Popover, SharePopover, PopupCompare, PopupReasonToBuy, popupcomparesamecategory]
})
export class AppModule { }
