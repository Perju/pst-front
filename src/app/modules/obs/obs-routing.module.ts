import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './views/help/help.component';
import { LoginComponent } from './views/login/login.component';
import { ControllerComponent } from './views/controller/controller.component';
import { LoggedInGuardService } from './services/logged-in-guard.service';
import { ObsLeftSideBarComponent } from './views/left-side-bar/left-side-bar.component';
import { OverlaysComponent } from './views/overlays/overlays.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'controller',
    component: ControllerComponent,
    canActivate: [LoggedInGuardService],
  },
  { path: 'help', component: HelpComponent },
  { path: 'overlays', component: OverlaysComponent },
  {
    path: 'menu',
    component: ObsLeftSideBarComponent,
    outlet: 'menu',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObsRoutingModule {}
