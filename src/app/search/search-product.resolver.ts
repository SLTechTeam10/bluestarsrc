import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../shell/data-store';
import { SearchService } from '../search/search.service'
import { SearchProductModel } from './search-product.model';

@Injectable()
export class SearchProductResolver implements Resolve<DataStore<SearchProductModel>> {

  constructor(private searchService: SearchService) {}

  resolve(): DataStore<SearchProductModel> {
    const dataSource: Observable<SearchProductModel> = this.searchService.getListingDataSource();
    const dataStore: DataStore<SearchProductModel> = this.searchService.getListingStore(dataSource);

    return dataStore;
  }
}
