import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ApplicationService } from "src/app/services/application.service";
import { ComponentsModule } from "../../../components/components.module";
import { HseRoute, HseRoutes } from "../../../helpers/hse.route";
import { ComplaintBuildingConfirmationComponent } from "./complaint-building-confirmation/complaint-building-confirmation.component";
import { NumberOfFloorsComponent } from "./number-of-floors/number-of-floors.component";
import { NumberOfUnitsComponent } from "./number-of-units/number-of-units.component";


const routes = new HseRoutes([
  HseRoute.protected(NumberOfFloorsComponent.route, NumberOfFloorsComponent, NumberOfFloorsComponent.title),
  HseRoute.protected(NumberOfUnitsComponent.route, NumberOfUnitsComponent, NumberOfUnitsComponent.title),
  HseRoute.protected(ComplaintBuildingConfirmationComponent.route, ComplaintBuildingConfirmationComponent, ComplaintBuildingConfirmationComponent.title),
  
]);

@NgModule({
  declarations: [
    NumberOfFloorsComponent,
    NumberOfUnitsComponent,
    ComplaintBuildingConfirmationComponent
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
export class ComplaintBuildingModule {
  static baseRoute: string = "building";
}
