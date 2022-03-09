import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { DataStore } from '../shell/data-store';
import { TermsOfUseModel } from './terms-of-use.model';

@Injectable()
export class TermsOfUseServicesPage {
  // private listingDataStore: DataStore<FoodListingModel>;
  private detailsDataStore: DataStore<TermsOfUseModel>;

  constructor(private http: HttpClient) { }

  // public getListingDataSource(): Observable<FoodListingModel> {
  //   return this.http.get<FoodListingModel>('./assets/sample-data/food/listing.json')
  //   .pipe(
  //     map(
  //       (data: FoodListingModel) => {
  //         // Note: HttpClient cannot know how to instantiate a class for the returned data
  //         // We need to properly cast types from json data
  //         const listing = new FoodListingModel();

  //         // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object.
  //         // Note: If you have non-enummerable properties, you can try a spread operator instead. listing = {...data};
  //         // (see: https://scotch.io/bar-talk/copying-objects-in-javascript#toc-using-spread-elements-)
  //         Object.assign(listing, data);

  //         return listing;
  //       }
  //     )
  //   );
  // }

  // public getListingStore(dataSource: Observable<FoodListingModel>): DataStore<FoodListingModel> {
  //   // Use cache if available
  //   if (!this.listingDataStore) {
  //     // Initialize the model specifying that it is a shell model
  //     const shellModel: FoodListingModel = new FoodListingModel();
  //     this.listingDataStore = new DataStore(shellModel);
  //     // Trigger the loading mechanism (with shell) in the dataStore
  //     this.listingDataStore.load(dataSource);
  //   }
  //   return this.listingDataStore;
  // }

 public getDetailsDataSource(slug: string): Observable<TermsOfUseModel> {
    return this.http.get<{items: Array<TermsOfUseModel>}>('./assets/sample-data/food/details.json')
    .pipe(
      flatMap(details => details.items.filter(item => item.slug === slug)),
      map(
        (data: TermsOfUseModel) => {
          // Note: HttpClient cannot know how to instantiate a class for the returned data
          // We need to properly cast types from json data
          const details = new TermsOfUseModel();

          // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object.
          // Note: If you have non-enummerable properties, you can try a spread operator instead. details = {...data};
          // (see: https://scotch.io/bar-talk/copying-objects-in-javascript#toc-using-spread-elements-)
          Object.assign(details, data);

          return details;
        }
      )
    );
 }

  getDetailsStore(dataSource: Observable<TermsOfUseModel>): DataStore<TermsOfUseModel> {
    // Initialize the model specifying that it is a shell model
    const shellModel: TermsOfUseModel = new TermsOfUseModel();
    this.detailsDataStore = new DataStore(shellModel);
    // Trigger the loading mechanism (with shell) in the dataStore
    this.detailsDataStore.load(dataSource);

    return this.detailsDataStore;
 }
}
