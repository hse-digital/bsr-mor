import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { AdvicePersonOrganisationModule } from "../advice/advice-person-organisation/advice-person-organisation.module";
import { AdviceBuildingModule } from "./advice-building/advice-building.module";


const routes = new HseRoutes([
  HseRoute.forLoadChildren(AdviceBuildingModule.baseRoute, () => import('../advice/advice-building/advice-building.module').then(m => m.AdviceBuildingModule)),
  HseRoute.forLoadChildren(AdvicePersonOrganisationModule.baseRoute, () => import('../advice/advice-person-organisation/advice-person-organisation.module').then(m => m.AdvicePersonOrganisationModule)),
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
export class AdviceModule {
  static baseRoute: string = "advice";
}
