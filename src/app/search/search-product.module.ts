import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';

import { SearchService } from '../search/search.service'
import { SearchProductPage } from './search-product.page';
import { SearchProductResolver } from './search-product.resolver';

const routes: Routes = [
  {
    path: '',
    component: SearchProductPage,
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
  declarations: [SearchProductPage],
  providers: [
    SearchProductResolver,
    SearchService
  ]
})
export class SearchProductPageModule {}
