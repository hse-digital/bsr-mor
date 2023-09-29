import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './locate-building.component.html'
})

export class LocateBuildingComponent extends PageComponent<string> {
  public static route: string = 'locate-building';
  static title: string = "How to locate building?";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Building) {
      applicationService.model.Building = {}
    }

    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building.LocateBuilding)) {
      applicationService.model.Building.LocateBuilding = "";
    }

    this.model = applicationService.model.Building?.LocateBuilding;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Building!.LocateBuilding = this.model;
  }
  canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    //if (applicationService.model.WhatToSubmit && applicationService.model.WhatToSubmit == "notice") {
      return true;
  //  } else if (applicationService.model.WhatToSubmit && applicationService.model.WhatToSubmit == "report" && applicationService.model?.Report?.NoticeReference) {
  //    return true;
  //  } else {
  //    return false;
  //  }
  }

  hasLocateBuildingErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasLocateBuildingErrors = this.modelValid;
    return !this.modelValid;
  }
  navigateNext(): Promise<boolean> {
    if (this.model == "northing")
      return this.navigationService.navigate('');
    else
      return this.navigationService.navigate('');
  }

}
