import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

import { PrivacyPolicyServicesPage } from './privacy-policy.service';
import { PrivacyPolicyPage } from './privacy-policy.page';
import { PrivacyPolicyResolver } from './privacy-policy.resolver';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyPage,
    resolve: {
      data: PrivacyPolicyResolver
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
    PrivacyPolicyPage
  ],
  providers: [
    PrivacyPolicyResolver,
    PrivacyPolicyServicesPage
  ]
})
export class PrivacyPolicyPageModule {}
