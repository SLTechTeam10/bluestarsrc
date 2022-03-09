import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../shell/data-store';
import { TermsOfUseServicesPage } from './terms-of-use.service';
import { TermsOfUseModel } from './terms-of-use.model';

@Injectable()
export class TermsOfUseResolver implements Resolve<DataStore<TermsOfUseModel>> {

  constructor(private PrivacyPolicyServices: TermsOfUseServicesPage) {}

  resolve(route: ActivatedRouteSnapshot): DataStore<TermsOfUseModel> {
    const itemSlug = route.paramMap.get('productId');

    const dataSource: Observable<TermsOfUseModel> = this.PrivacyPolicyServices.getDetailsDataSource(itemSlug);
    const dataStore: DataStore<TermsOfUseModel> = this.PrivacyPolicyServices.getDetailsStore(dataSource);

    return dataStore;
  }
}
