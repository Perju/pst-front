import { NgModule } from '@angular/core'
import { RouterModule, Routes} from '@angular/router'
import { CommandsComponent } from './views/commands/commands.component'
import { TwitchHelpComponent } from './views/help/help.component'
import { TwitchLoginComponent } from './views/login/login.component'
import { TimersComponent } from './views/timers/timers.component'

export const twitchRoutes: Routes = [
  {
    path: 'twitch',
    children: [
      { path: 'help', component: TwitchHelpComponent },
      { path: 'timers', component: TimersComponent },
      { path: 'commands', component: CommandsComponent },
      { path: 'login', component: TwitchLoginComponent }
    ]
  }
]

const routes: Routes = [...twitchRoutes]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwitchRoutingModule {}
