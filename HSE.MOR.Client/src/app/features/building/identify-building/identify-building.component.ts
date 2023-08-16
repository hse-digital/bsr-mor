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
    this.model = applicationService.model.IdentifyBuilding;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.IdentifyBuilding = this.model;
  }
  canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
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
