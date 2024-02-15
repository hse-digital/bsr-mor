import { NgModule } from "@angular/core";
import { IdentifyBuildingPipe } from "./identify-building.pipe";
import { OrgRolePipe } from "./org-role.pipe";
import { OrgTypePipe } from "./org-type.pipe";
import { WhatToSubmitPipe } from "./what-to-submit.pipe";

@NgModule({
  declarations: [
    OrgRolePipe,
    OrgTypePipe,
    IdentifyBuildingPipe,
    WhatToSubmitPipe
  ],
  exports: [
    OrgRolePipe,
    OrgTypePipe,
    IdentifyBuildingPipe,
    WhatToSubmitPipe
  ]
})

export class PipeModule { }
