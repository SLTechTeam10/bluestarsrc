import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { ProductService } from '../product.service';
import { ProductDetailsModel } from './product-details.model';

@Injectable()
export class ProductDetailsResolver implements Resolve<DataStore<ProductDetailsModel>> {

  constructor(private productService: ProductService) {}

  resolve(): DataStore<ProductDetailsModel> {
    const dataSource: Observable<ProductDetailsModel> = this.productService.getDetailsDataSource();
    const dataStore: DataStore<ProductDetailsModel> = this.productService.getDetailsStore(dataSource);

    return dataStore;
  }
}
