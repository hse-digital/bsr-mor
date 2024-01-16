import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NotFoundComponent } from '../../../components/not-found/not-found.component';
import { NavigationHelper } from '../../../helpers/navigation.helper';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';
import { BcaReferenceNumberComponent } from '../bca-reference-number/bca-reference-number.component';
import { HrbrReferenceNumberComponent } from '../hrbr-reference-number/hrbr-reference-number.component';
import { IsBuildingComponent } from '../is-building/is-building.component';

@Component({
  templateUrl: './identify-building.component.html'
})

export class IdentifyBuildingComponent extends PageComponent<string> {
  public static route: string = 'identify-building';
  static title: string = "How can you identify your building? - Submit a mandatory occurrence notice and report";


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Building) {
      applicationService.model.Building = {}
    }

    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building.IdentifyBuilding)) {
      applicationService.model.Building.IdentifyBuilding = "";
    }

    this.model = applicationService.model.Building?.IdentifyBuilding;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Building!.IdentifyBuilding = this.model;
  }
  canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    if (applicationService.model.WhatToSubmit && applicationService.model.WhatToSubmit == "notice") {
      return true;
    } else if (applicationService.model.WhatToSubmit && applicationService.model.WhatToSubmit == "report" && !applicationService.model.Report!.NoticeReference) {
      return true;
    } else {
      return false;
    }
  }

  navigateToisBuilding() {
    this.navigationService.navigateRelative(IsBuildingComponent.route, this.activatedRoute);
  }

  hasIdentifyBuildingErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasIdentifyBuildingErrors = this.modelValid;
    return !this.modelValid;
  }
  getRouteKey(key: string) {
    switch (key) {
      case "building_reference": return BcaReferenceNumberComponent.route;
      case "building_registration": return HrbrReferenceNumberComponent.route;
    }
    return NotFoundComponent.route;
  }

  navigateNext(): Promise<boolean> {
    var routeKey = this.getRouteKey(this.model!);
    return this.navigationService.navigateRelative(routeKey, this.activatedRoute);
  }

}
