import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { ProductService } from '../product.service';
import { ProductListingModel } from './product-listing.model';

@Injectable()
export class ProductListingResolver implements Resolve<DataStore<ProductListingModel>> {

  constructor(private productService: ProductService) {}

  resolve(): DataStore<ProductListingModel> {
    const dataSource: Observable<ProductListingModel> = this.productService.getListingDataSource();
    const dataStore: DataStore<ProductListingModel> = this.productService.getListingStore(dataSource);

    return dataStore;
  }
}
