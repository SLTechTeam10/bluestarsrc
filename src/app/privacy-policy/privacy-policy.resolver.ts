import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../shell/data-store';
import { PrivacyPolicyServicesPage } from './privacy-policy.service';
import { PrivacyPolicyModel } from './privacy-policy.model';

@Injectable()
export class PrivacyPolicyResolver {

  constructor(private PrivacyPolicyServices: PrivacyPolicyServicesPage) {}

  resolve(route: ActivatedRouteSnapshot): DataStore<PrivacyPolicyModel> {
    const itemSlug = route.paramMap.get('productId');

    const dataSource: Observable<PrivacyPolicyModel> = this.PrivacyPolicyServices.getDetailsDataSource(itemSlug);
    const dataStore: DataStore<PrivacyPolicyModel> = this.PrivacyPolicyServices.getDetailsStore(dataSource);

    return dataStore;
  }
}
