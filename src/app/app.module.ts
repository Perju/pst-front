import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { ObsModule } from './modules/obs/obs.module'
import { MaterialUiModule } from './modules/material-ui.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUiModule,
    ObsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
