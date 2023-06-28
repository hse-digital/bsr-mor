import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { AdviceModel, ApplicationService } from "../../../../services/application.service";
import { FieldValidations } from "../../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './prof-number-of-floors.component.html'
})

export class ProfNumberOfFloorsComponent extends PageComponent<number> {
  public static route: string = 'prof-number-of-floors';
  static title: string = "How many floors does the building have?";

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Advice.NumberOfFloors;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Advice.NumberOfFloors = this.model;
    applicationService.model.Complaint.NumberOfFloors = undefined;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  floorsHasError = false;
  errorMessage: string = 'You need to tell us how many floors the building has';

  override isValid(): boolean {
    this.floorsHasError = true;
    let floorsAbove = this.model;

    if (!floorsAbove || !Number(floorsAbove) || floorsAbove % 1 != 0) {
      this.errorMessage = 'You need to tell us how many floors the building has';
    } else if (floorsAbove >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (floorsAbove < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.floorsHasError = false;
    }

    return !this.floorsHasError;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('building-height', this.activatedRoute);
  }
}
