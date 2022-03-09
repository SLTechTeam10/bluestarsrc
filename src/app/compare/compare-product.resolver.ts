import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../shell/data-store';
import { SearchService } from '../search/search.service'
import { CompareProductModel } from './compare-produc.model';

@Injectable()
export class SearchProductResolver implements Resolve<DataStore<CompareProductModel>> {

  constructor(private searchService: SearchService) {}

  resolve(): DataStore<CompareProductModel> {
    const dataSource: Observable<CompareProductModel> = this.searchService.getListingDataSource();
    const dataStore: DataStore<CompareProductModel> = this.searchService.getListingStore(dataSource);

    return dataStore;
  }
}
