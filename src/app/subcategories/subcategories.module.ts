import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';

import { SubcategoriesPage } from './subcategories.page';

const subcategoriesRoutes: Routes = [
  {
    path: '',
    component: SubcategoriesPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(subcategoriesRoutes),
    ComponentsModule
  ],
  declarations: [SubcategoriesPage]
})
export class SubcategoriesPageModule {}
