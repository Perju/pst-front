import { NgModule } from '@angular/core';

import { TwitchHelpComponent } from './views/help/help.component';
import { TimersComponent } from './views/timers/timers.component';
import { TwitchLoginComponent } from './views/login/login.component';
import { CommandsComponent } from './views/commands/commands.component';
import { TwitchLeftSideBarComponent } from './views/left-side-bar/left-side-bar.component';
import { MaterialUiModule } from '../material-ui.module';
import { TwitchRoutingModule } from './twitch-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    TwitchHelpComponent,
    TimersComponent,
    TwitchLoginComponent,
    CommandsComponent,
    TwitchLeftSideBarComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialUiModule,
    TwitchRoutingModule
  ],
  exports: [
    TwitchHelpComponent,
    TimersComponent,
    TwitchLoginComponent,
    CommandsComponent,
    TwitchLeftSideBarComponent,
    HttpClientModule
  ],
  providers: [HttpClientModule]
})
export class TwitchModule {}
