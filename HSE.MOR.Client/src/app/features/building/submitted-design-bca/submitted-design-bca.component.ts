import { Component } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { PageComponent } from '../../../helpers/page.component';
import { FieldValidations } from '../../../helpers/validators/fieldvalidations';
import { ApplicationService } from '../../../services/application.service';
import { BcaReferenceNumberComponent } from '../bca-reference-number/bca-reference-number.component';
import { NoNeedMorComponent } from '../no-need-mor/no-need-mor.component';

@Component({
  templateUrl: './submitted-design-bca.component.html'
})

export class SubmittedDesignBcaComponent extends PageComponent<string> {
  public static route: string = 'submitted-design-bca';
  static title: string = "Have you submitted the design to building control approval?";

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Building) {
      applicationService.model.Building = {};
    }
    if (!FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building.SubmittedDesignBca)) {
      applicationService.model.Building.SubmittedDesignBca = "";
    }
    this.model = applicationService.model.Building?.SubmittedDesignBca;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Building!.SubmittedDesignBca = this.model;
  }
  canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Building?.BuildingType) && applicationService.model.Building?.BuildingType == "in_design";
  }

  hasSubmittedDesignBcaErrors: boolean = false;
  modelValid: boolean = false;

  isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    this.hasSubmittedDesignBcaErrors = this.modelValid;
    return !this.modelValid;
  }
  navigateNext(): Promise<boolean> {
    return this.model == "yes_reference"
      ? this.navigationService.navigateRelative(BcaReferenceNumberComponent.route, this.activatedRoute)
      : this.navigationService.navigateRelative(NoNeedMorComponent.route, this.activatedRoute);
  }

}
