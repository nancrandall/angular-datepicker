import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'

import { MainPageComponent } from './main-page/main-page.component'

@NgModule({
  declarations:
  [ 
    AppComponent,
    MainPageComponent
   ],
  imports: [
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
