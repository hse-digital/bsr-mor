import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../../components/components.module";
import { HseRoute, HseRoutes } from "../../../helpers/hse.route";
import { BuildingHeightComponent } from "../advice-building/building-height/building-height.component";
import { ProfNumberOfFloorsComponent } from "../advice-building/prof-number-of-floors/prof-number-of-floors.component";
import { ProfNumberOfUnitsComponent } from "../advice-building/prof-number-of-units/prof-number-of-units.component";
import { AdviceBuildingConfirmationComponent } from "./advice-building-confirmation/advice-building-confirmation.component";


const routes = new HseRoutes([
  HseRoute.protected(ProfNumberOfFloorsComponent.route, ProfNumberOfFloorsComponent, ProfNumberOfFloorsComponent.title),
  HseRoute.protected(ProfNumberOfUnitsComponent.route, ProfNumberOfUnitsComponent, ProfNumberOfUnitsComponent.title),
  HseRoute.protected(BuildingHeightComponent.route, BuildingHeightComponent, BuildingHeightComponent.title),
  HseRoute.protected(AdviceBuildingConfirmationComponent.route, AdviceBuildingConfirmationComponent, AdviceBuildingConfirmationComponent.title),
]);

@NgModule({
  declarations: [
    ProfNumberOfFloorsComponent,
    ProfNumberOfUnitsComponent,
    BuildingHeightComponent,
    AdviceBuildingConfirmationComponent,

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
export class AdviceBuildingModule {
  static baseRoute: string = "building";
}
