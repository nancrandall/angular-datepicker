import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { ButtonPageComponent } from './button-page/button-page.component'
import { MainPageComponent } from './main-page/main-page.component'

const appRoutes: Routes =
[
  {
    path: 'main',
    component: MainPageComponent
  },
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  }
];


@NgModule
({
  imports:[ RouterModule.forRoot(appRoutes, {useHash: true}) ],

  exports:
  [
    RouterModule
  ],

  providers: []
})
export class AppRoutingModule {}