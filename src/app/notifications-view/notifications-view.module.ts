import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '../components/components.module';

import { NotificationsViewPage } from './notifications-view.page';

const notificationsViewRoutes: Routes = [
  {
    path: '',
    component: NotificationsViewPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(notificationsViewRoutes),
    ComponentsModule
  ],
  declarations: [NotificationsViewPage]
})
export class NotificationsViewPageModule { }
