import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { ApplicationService } from "../../services/application.service";
import { IsBuildingComponent } from "./is-building/is-building.component";

const routes = new HseRoutes([
  HseRoute.protected(IsBuildingComponent.route, IsBuildingComponent, IsBuildingComponent.title),
]);

@NgModule({
  declarations: [
    IsBuildingComponent
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
