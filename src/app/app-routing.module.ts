import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllerLayoutComponent } from './layout/controller-layout/controller-layout.component';
import { OverlayComponent } from './layout/overlay/overlay.component';
import { OvlTimerComponent } from './modules/obs/views/overlays/ovl-timer/ovl-timer.component';
import { ClipViewerComponent } from './modules/obs/views/overlays/clip-viewer/clip-viewer.component';


const routes: Routes = [
  {
    path: '',
    component: ControllerLayoutComponent,
    children: [
      {
        path: 'twitch',
        loadChildren: () =>
          import('./modules/twitch/twitch.module').then(m => m.TwitchModule),
      },
      {
        path: 'obs',
        loadChildren: () =>
          import('./modules/obs/obs.module').then(m => m.ObsModule),
      },
    ],
  },
  {
    path: 'overlays',
    component: OverlayComponent,
    children: [
      {
        path: 'timer',
        component: OvlTimerComponent,
      },
      {
        path: 'twitch/clips-viewer',
        component: ClipViewerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
