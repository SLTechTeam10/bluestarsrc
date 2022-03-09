import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { ProductService } from '../product.service';
import { ProductDetailsPage } from './product-details.page';
import { ProductDetailsResolver } from './product-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailsPage,
    resolve: {
      data: ProductDetailsResolver
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
  declarations: [
    ProductDetailsPage
  ],
  providers: [
    ProductDetailsResolver,
    ProductService
  ]
})
export class ProductDetailsPageModule {}
