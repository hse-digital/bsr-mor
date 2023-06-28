import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { ApplicationService } from "../../../../services/application.service";
import { FieldValidations } from "../../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './number-of-floors.component.html'
})

export class NumberOfFloorsComponent extends PageComponent<string> {
  public static route: string = 'number-of-floors';
  static title: string = "How big is the building?";

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }

  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Complaint.NumberOfFloors;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Complaint.NumberOfFloors = this.model;
    applicationService.model.Advice.NumberOfFloors = undefined;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;
  override isValid(): boolean {
    this.modelValid = !FieldValidations.IsNotNullOrWhitespace(this.model);
    return !this.modelValid;
  }
  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative('number-of-units', this.activatedRoute);
  }

}
