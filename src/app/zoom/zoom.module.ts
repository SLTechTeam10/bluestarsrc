import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';

import { ZoomPage } from './zoom.page';

const zoomRoutes: Routes = [
  {
    path: '',
    component: ZoomPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(zoomRoutes),
    ComponentsModule
  ],
  declarations: [ZoomPage]
})
export class ZoomPageModule { }
