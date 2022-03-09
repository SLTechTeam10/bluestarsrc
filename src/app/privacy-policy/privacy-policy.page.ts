import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../utils/resolver-helper';
import { PrivacyPolicyModel } from './privacy-policy.model';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: [
    './styles/privacy-policy.page.scss',
    './styles/privacy-policy.shell.scss'
  ]
})
export class PrivacyPolicyPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  details: PrivacyPolicyModel;

  // @HostBinding('class.is-shell') get isShell() {
  //   return (this.details && this.details.isShell) ? true : false;
  // }

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // // On init, the route subscription is the active subscription
    // this.subscriptions = this.route.data
    // .subscribe(
    //   (resolvedRouteData: IResolvedRouteData<PrivacyPolicyModel>) => {
    //     // Route subscription resolved, now the active subscription is the Observable extracted from the resolved route data
    //     this.subscriptions = ResolverHelper.extractData<PrivacyPolicyModel>(resolvedRouteData.data, PrivacyPolicyModel)
    //     .subscribe(
    //       (state) => {
    //         this.details = state;
    //       },
    //       (error) => {}
    //     );
    //   },
    //   (error) => {}
    // );
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    // console.log('TravelListingPage [ionViewWillLeave]');
    // this.subscriptions.unsubscribe();
  }
}
