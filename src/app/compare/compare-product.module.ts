import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';

import { SearchService } from '../search/search.service'
import { CompareProductPage } from './compare-product.page';
import { SearchProductResolver } from './compare-product.resolver';

const routes: Routes = [
  {
    path: '',
    component: CompareProductPage,
    resolve: {
      data: SearchProductResolver
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
  declarations: [CompareProductPage],
  providers: [
    SearchProductResolver,
    SearchService
  ]
})
export class CompareProductPageModule {}
