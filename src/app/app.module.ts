import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialUiModule } from './modules/material-ui.module';
import { ObsModule } from './modules/obs/obs.module';
import { TwitchModule } from './modules/twitch/twitch.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialUiModule,
    ObsModule,
    TwitchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
