import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllerLayoutComponent } from './layout/controller-layout/controller-layout.component';
import { OverlayComponent } from './layout/overlay/overlay.component';
import { OvlTimerComponent } from './modules/obs/views/overlays/ovl-timer/ovl-timer.component';

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
        path: 'obs/timer',
        component: OvlTimerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
