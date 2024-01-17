import { NgModule } from "@angular/core";
import { IdentifyBuildingPipe } from "./identify-building.pipe";
import { OrgRolePipe } from "./org-role.pipe";
import { WhatToSubmitPipe } from "./what-to-submit.pipe";

@NgModule({
  declarations: [
    OrgRolePipe,
    IdentifyBuildingPipe,
    WhatToSubmitPipe
  ],
  exports: [
    OrgRolePipe,
    IdentifyBuildingPipe,
    WhatToSubmitPipe
  ]
})

export class PipeModule { }
