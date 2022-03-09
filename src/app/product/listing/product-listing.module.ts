import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { ProductService } from '../product.service';
import { ProductListingPage } from './product-listing.page';
import { ProductListingResolver } from './product-listing.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductListingPage,
    resolve: {
      data: ProductListingResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HttpClientModule
  ],
  declarations: [ProductListingPage],
  providers: [
    ProductListingResolver,
    ProductService
  ]
})
export class ProductListingPageModule {}
