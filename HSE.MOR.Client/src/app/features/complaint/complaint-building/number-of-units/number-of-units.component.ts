import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { ApplicationService } from "../../../../services/application.service";
import { FieldValidations } from "../../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './number-of-units.component.html'
})

export class NumberOfUnitsComponent extends PageComponent<string> {
  public static route: string = 'number-of-units';
  static title: string = "Are there 2 or more residences in the building?";

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }
  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Complaint.NumberOfUnits;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Complaint.NumberOfUnits = this.model;
    applicationService.model.Advice.BuildingHeight = undefined;
    applicationService.model.Advice.NumberOfUnits = undefined;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsNotNullOrWhitespace(applicationService.model.Complaint.NumberOfFloors);
  }

  modelValid: boolean = false;
  override isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    return !this.modelValid;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('confirmation', this.activatedRoute);
  }

}
