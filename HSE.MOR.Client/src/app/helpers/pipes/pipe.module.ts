import { NgModule } from "@angular/core";
import { OrgRolePipe } from "./org-role.pipe";

@NgModule({
  declarations: [
    OrgRolePipe,
  ],
  exports: [
    OrgRolePipe
  ]
})

export class PipeModule { }
