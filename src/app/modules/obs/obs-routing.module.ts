import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponent } from './views/help/help.component';
import { LoginComponent } from './views/login/login.component';
import { ControllerComponent } from './views/controller/controller.component';
import { LoggedInGuardService } from './services/logged-in-guard.service';
import { ObsLeftSideBarComponent } from './views/left-side-bar/left-side-bar.component';
import { OverlaysComponent } from './views/overlays/ovl-timer/controler/overlays.component';
import { ClipViewerComponent } from './views/overlays/clip-viewer/clip-viewer.component';
import { ClipViewerControllerComponent } from './views/overlays/clip-viewer/clip-viewer-controller/clip-viewer-controller.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'controller',
    component: ControllerComponent,
    canActivate: [LoggedInGuardService],
  },
  { path: 'help', component: HelpComponent },
  { path: 'overlays', component: OverlaysComponent },
  { path: 'clip-controller', component: ClipViewerControllerComponent },
  { path: 'clip/:userId', component: ClipViewerComponent },
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
