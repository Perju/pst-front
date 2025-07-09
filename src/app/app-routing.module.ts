import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllerLayoutComponent } from './layout/controller-layout/controller-layout.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
