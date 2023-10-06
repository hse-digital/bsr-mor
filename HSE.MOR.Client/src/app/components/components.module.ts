import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { HseAngularModule } from "hse-angular";
import { CommonModule } from "@angular/common";

import { GovukRequiredDirective } from "./required.directive";
import { SelectAddressComponent } from "./address/select-address.component";
import { TooManyAddressComponent } from "./address/too-many-address.component";
import { NotFoundAddressComponent } from "./address/not-found-address.component";
import { ManualAddressComponent } from "./address/manual-address.component";
import { ConfirmAddressComponent } from "./address/confirm-address.component";
import { AddressComponent } from "./address/address.component";
import { FindAddressComponent } from "./address/find-address.component";
import { AddressDescriptionComponent } from "./address-description.component";
import { AddressRegionNotInScopeAddressComponent } from "./address/address-region-not-in-scope.component";
import { RegionAddressComponent } from "./address/region-address.component";
import { AddressNumberOfFloorsComponent } from "./address/address-number-of-floors.component";
import { AddressBuildingNotInScopeComponent } from "./address/address-building-not-in-scope.component";
import { AddressNumberOfUnitsComponent } from "./address/address-number-of-units.component";
import { AddressProfNumberOfFloorsComponent } from "./address/address-prof-number-of-floors.component";
import { AddressProfNumberOfUnitsComponent } from "./address/address-prof-number-of-units.component";
import { AddressBuildingHeightComponent } from "./address/address-building-height.component";
import { HasAddressComponent } from "./address/has-address.component";
import { LocateBuildingAddressComponent } from "./address/locate-building-address.component";
import { AddressCoordinatesComponent } from "./address/address-coordinates.component";

@NgModule({
  declarations: [
    GovukRequiredDirective,
    AddressComponent,
    ConfirmAddressComponent,
    NotFoundAddressComponent,
    ManualAddressComponent,
    NotFoundAddressComponent,
    TooManyAddressComponent,
    SelectAddressComponent,
    FindAddressComponent,
    AddressRegionNotInScopeAddressComponent,
    RegionAddressComponent,
    AddressDescriptionComponent,
    AddressNumberOfFloorsComponent,
    AddressNumberOfUnitsComponent,
    AddressProfNumberOfFloorsComponent,
    AddressProfNumberOfUnitsComponent,
    AddressBuildingHeightComponent,
    AddressBuildingNotInScopeComponent,
    HasAddressComponent,
    LocateBuildingAddressComponent,
    AddressCoordinatesComponent,
  ],
  imports: [
    HseAngularModule,
    CommonModule,
    HttpClientModule
  ],
  exports: [
    GovukRequiredDirective,
    AddressComponent,
    AddressDescriptionComponent,
  ],
  providers: [HttpClient]
})
export class ComponentsModule {

}
