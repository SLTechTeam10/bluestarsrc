import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.page.html',
  styleUrls: [
    './styles/contact-card.page.scss',
    './styles/contact-card.shell.scss'
  ]
})
export class ContactCardPage {

  constructor(private callNumber: CallNumber) { }



  launchDialer(number){
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

 }

 