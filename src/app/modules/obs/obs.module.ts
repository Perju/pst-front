import { NgModule } from '@angular/core';
import { HelpComponent } from './views/help/help.component';
import { LoginComponent } from './views/login/login.component';
import { ControllerComponent } from './views/controller/controller.component';
import { ObsLeftSideBarComponent } from './views/left-side-bar/left-side-bar.component';
import { ObsRightSideBarComponent } from './views/right-side-bar/right-side-bar.component';
import { MaterialUiModule } from '../material-ui.module';
import { ObsRoutingModule } from './obs-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlaysComponent } from './views/overlays/ovl-timer/controler/overlays.component';
import { ClipViewerComponent } from './views/overlays/clip-viewer/clip-viewer.component';

@NgModule({
  declarations: [
    HelpComponent,
    LoginComponent,
    ControllerComponent,
    ObsLeftSideBarComponent,
    ObsRightSideBarComponent,
    OverlaysComponent,
  ],
  imports: [
    CommonModule,
    ObsRoutingModule,
    MaterialUiModule,
    FormsModule,
    ReactiveFormsModule,
    ClipViewerComponent,
  ],
  exports: [
    ObsLeftSideBarComponent,
    HelpComponent,
    LoginComponent,
    ControllerComponent,
    ObsLeftSideBarComponent,
    ObsRightSideBarComponent,
    ClipViewerComponent,
  ],
  schemas: [],
})
export class ObsModule {}
