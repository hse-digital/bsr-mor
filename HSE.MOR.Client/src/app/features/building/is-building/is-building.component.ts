import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';
import { BuildingAddressComponent } from '../building-address/building-address.component';
import { SubmittedDesignBcaComponent } from '../submitted-design-bca/submitted-design-bca.component';

@Component({
  templateUrl: './is-building.component.html'
})

export class IsBuildingComponent extends PageComponent<string> {
  public static route: string = 'is-building';
  static title: string = "How would you describe the building? - Submit a mandatory occurrence notice and report";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Building) {
      applicationService.model.Building = {}
    }
    if (FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building.IdentifyBuilding)) {
      applicationService.model.Building.IdentifyBuilding = undefined;
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building.BuildingType)) {
      applicationService.model.Building.BuildingType = "";
    }

    this.model = applicationService.model.Building?.BuildingType;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Building!.BuildingType = this.model;
  }
  canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.WhatToSubmit);
  }

  hasIsBuildingErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasIsBuildingErrors = this.modelValid;
    return !this.modelValid;
  }
  navigateNext(): Promise<boolean> {
    return this.model !== "in_design"
      ? this.navigationService.navigateRelative(BuildingAddressComponent.route, this.activatedRoute)
      : this.navigationService.navigateRelative(SubmittedDesignBcaComponent.route, this.activatedRoute);
  }

}
