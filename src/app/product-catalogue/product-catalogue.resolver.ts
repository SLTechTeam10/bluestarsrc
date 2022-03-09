import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../shell/data-store';
import { ProductCatalogueService } from '../product-catalogue/product-catalogue.service'
import { ProductCatalogueModel } from './product-catalogue.model';

@Injectable()
export class ProductCatalogueResolver implements Resolve<DataStore<ProductCatalogueModel>> {

  constructor(private productCatalogueService: ProductCatalogueService) {}

  resolve(): DataStore<ProductCatalogueModel> {
    const dataSource: Observable<ProductCatalogueModel> = this.productCatalogueService.getListingDataSource();
    const dataStore: DataStore<ProductCatalogueModel> = this.productCatalogueService.getListingStore(dataSource);

    return dataStore;
  }
}
