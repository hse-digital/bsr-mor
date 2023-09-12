import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';

@Component({
  templateUrl: './is-building.component.html'
})

export class IsBuildingComponent extends PageComponent<string> {
  public static route: string = 'is-building';
  static title: string = "Is the building";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Building) {
      applicationService.model.Building = {}
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
    return true;
  }

  hasIsBuildingErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasIsBuildingErrors = this.modelValid;
    return !this.modelValid;
  }
  navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }

}
