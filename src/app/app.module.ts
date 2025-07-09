import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialUiModule } from './modules/material-ui.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControllerLayoutComponent } from './layout/controller-layout/controller-layout.component';
import { ObsModule } from './modules/obs/obs.module';
import { TwitchModule } from './modules/twitch/twitch.module';

@NgModule({
  declarations: [AppComponent, ControllerLayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUiModule,
    ObsModule,
    TwitchModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [MaterialUiModule],
})
export class AppModule {}
