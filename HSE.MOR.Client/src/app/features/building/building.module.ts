import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { ApplicationService } from "../../services/application.service";
import { IdentifyBuildingComponent } from "./identify-building/identify-building.component";

const routes = new HseRoutes([
  HseRoute.protected(IdentifyBuildingComponent.route, IdentifyBuildingComponent, IdentifyBuildingComponent.title),
]);

@NgModule({
  declarations: [
    IdentifyBuildingComponent
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
export class BuildingModule {
  static baseRoute: string = "building";
}
