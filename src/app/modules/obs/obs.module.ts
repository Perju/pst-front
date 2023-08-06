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

@NgModule({
  declarations: [
    HelpComponent,
    LoginComponent,
    ControllerComponent,
    ObsLeftSideBarComponent,
    ObsRightSideBarComponent
  ],
  imports: [
    CommonModule,
    ObsRoutingModule,
    MaterialUiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ObsLeftSideBarComponent,
    HelpComponent,
    LoginComponent,
    ControllerComponent,
    ObsLeftSideBarComponent,
    ObsRightSideBarComponent
  ],
  schemas: []
})
export class ObsModule {}
