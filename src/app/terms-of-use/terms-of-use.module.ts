import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

import { TermsOfUseServicesPage } from './terms-of-use.service';
import { TermsOfUsePage } from './terms-of-use.page';
import { TermsOfUseResolver } from './terms-of-use.resolver';

const routes: Routes = [
  {
    path: '',
    component: TermsOfUsePage,
    resolve: {
      data: TermsOfUseResolver
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
    PipesModule,
    HttpClientModule
  ],
  declarations: [
    TermsOfUsePage
  ],
  providers: [
    TermsOfUseResolver,
    TermsOfUseServicesPage
  ]
})
export class TermsOfUsePageModule {}
