import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommandsComponent } from './views/commands/commands.component';
import { TwitchHelpComponent } from './views/help/help.component';
import { TwitchLoginComponent } from './views/login/login.component';
import { TimersComponent } from './views/timers/timers.component';
import { TwitchLeftSideBarComponent } from './views/left-side-bar/left-side-bar.component';

export const twitchRoutes: Routes = [
  { path: '', component: TwitchLoginComponent },
  { path: 'help', component: TwitchHelpComponent },
  { path: 'timers', component: TimersComponent },
  { path: 'commands', component: CommandsComponent },
  {
    path: 'menu',
    component: TwitchLeftSideBarComponent,
    outlet: 'menu',
  },
];

const routes: Routes = [...twitchRoutes];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TwitchRoutingModule {}
