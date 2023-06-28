import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { ComplaintPersonOrganisationModule } from "../complaint/complaint-person-organisation/complaint-person-organisation.module";
import { ComplaintBuildingModule } from "./complaint-building/complaint-building.module";

const routes = new HseRoutes([
  HseRoute.forLoadChildren(ComplaintBuildingModule.baseRoute, () => import('../complaint/complaint-building/complaint-building.module').then(m => m.ComplaintBuildingModule)),
  HseRoute.forLoadChildren(ComplaintPersonOrganisationModule.baseRoute, () => import('../complaint/complaint-person-organisation/complaint-person-organisation.module').then(m => m.ComplaintPersonOrganisationModule)),
]);

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes.getRoutes()),
    HseAngularModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule
  ],
  providers: [HttpClient, ApplicationService, ...routes.getProviders()]
})
export class ComplaintModule {
  static baseRoute: string = "complaint";
}
