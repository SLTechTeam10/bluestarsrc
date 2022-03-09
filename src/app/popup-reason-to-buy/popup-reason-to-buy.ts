import { Component } from '@angular/core';
import { NavParams, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'popup-reason-to-buy',
  templateUrl: 'popup-reason-to-buy.html',
  styleUrls: ['./popup-reason-to-buy.scss']
})

export class PopupReasonToBuy {

  uspData = [];
  uspDescription: any;
  constructor(public modalCtrl: ModalController, private route: ActivatedRoute,
    private navParams: NavParams, public loadingController: LoadingController,
    private storage: Storage, public alertController: AlertController) {

    this.uspData = this.navParams.get('item');
    this.uspDescription = this.uspData[1];
    console.log("uspData", this.uspData);
    console.log("uspDescription", this.uspDescription);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
