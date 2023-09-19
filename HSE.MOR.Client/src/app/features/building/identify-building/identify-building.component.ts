import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './identify-building.component.html'
})

export class IdentifyBuildingComponent extends PageComponent<string> {
  public static route: string = 'identify-building';
  static title: string = "How can you identify your building?";

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
    } else if (applicationService.model.WhatToSubmit && applicationService.model.WhatToSubmit == "report" && applicationService.model?.Report?.NoticeReference) {
      return true;
    } else {
      return false;
    }
  }

  hasIdentifyBuildingErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasIdentifyBuildingErrors = this.modelValid;
    return !this.modelValid;
  }
  navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }

}
