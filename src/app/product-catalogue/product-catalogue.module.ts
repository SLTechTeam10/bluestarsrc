import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';

import { ProductCatalogueService } from '../product-catalogue/product-catalogue.service'
import { ProductCataloguetPage } from './product-catalogue.page';
import { ProductCatalogueResolver } from './product-catalogue.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductCataloguetPage,
    resolve: {
      data: ProductCatalogueResolver
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
  declarations: [ProductCataloguetPage],
  providers: [
    ProductCatalogueResolver,
    ProductCatalogueService
  ]
})
export class ProductCataloguetPagePageModule {}
