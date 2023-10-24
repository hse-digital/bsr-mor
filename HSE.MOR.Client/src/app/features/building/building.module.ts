import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HseAngularModule } from "hse-angular";
import { ComponentsModule } from "../../components/components.module";
import { HseRoute, HseRoutes } from "../../helpers/hse.route";
import { ApplicationService } from "../../services/application.service";
import { IdentifyBuildingComponent } from "./identify-building/identify-building.component";
import { SubmittedDesignBcaComponent } from "./submitted-design-bca/submitted-design-bca.component";
import { IsBuildingComponent } from "./is-building/is-building.component";
import { BuildingAddressComponent } from "./building-address/building-address.component";
import { BcaReferenceNumberComponent } from "./bca-reference-number/bca-reference-number.component";
import { HrbrReferenceNumberComponent } from "./hrbr-reference-number/hrbr-reference-number.component";
import { NoNeedMorComponent } from "./no-need-mor/no-need-mor.component";

const routes = new HseRoutes([
  HseRoute.protected(IsBuildingComponent.route, IsBuildingComponent, IsBuildingComponent.title),
  HseRoute.protected(IdentifyBuildingComponent.route, IdentifyBuildingComponent, IdentifyBuildingComponent.title),
  HseRoute.protected(SubmittedDesignBcaComponent.route, SubmittedDesignBcaComponent, SubmittedDesignBcaComponent.title),
  HseRoute.protected(BuildingAddressComponent.route, BuildingAddressComponent, BuildingAddressComponent.title),
  HseRoute.protected(BcaReferenceNumberComponent.route, BcaReferenceNumberComponent, BcaReferenceNumberComponent.title),
  HseRoute.protected(HrbrReferenceNumberComponent.route, HrbrReferenceNumberComponent, HrbrReferenceNumberComponent.title),
  HseRoute.protected(NoNeedMorComponent.route, NoNeedMorComponent, NoNeedMorComponent.title),
]);

@NgModule({
  declarations: [
    IdentifyBuildingComponent,
    SubmittedDesignBcaComponent,
    IsBuildingComponent,
    BuildingAddressComponent,
    BcaReferenceNumberComponent,
    HrbrReferenceNumberComponent,
    NoNeedMorComponent,
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
