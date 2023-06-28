import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { AdviceModel, ApplicationService } from "../../../../services/application.service";
import { FieldValidations } from "../../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NotFoundComponent } from '../../../../components/not-found/not-found.component';

@Component({
  templateUrl: './building-height.component.html'
})

export class BuildingHeightComponent extends PageComponent<number> {
  public static route: string = 'building-height';
  static title: string = "Building height";
  inScope: boolean = true;

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }
  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Advice.BuildingHeight;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Advice.BuildingHeight = this.model;
    applicationService.model.Complaint.NumberOfUnits = undefined;
    this.inScope = this.isInScope(applicationService.model.Advice);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return FieldValidations.IsWholeNumber(applicationService.model.Advice.NumberOfFloors) &&
      FieldValidations.IsGreaterThanZero(applicationService.model.Advice.NumberOfFloors) &&
      FieldValidations.IsAPositiveNumber(applicationService.model.Advice.NumberOfFloors);
  }
  heightHasError = false;
  errorMessage: string = 'You need to tell us how tall the building is in metres';

  override isValid(): boolean {
    this.heightHasError = true;
    let buidlingHeight = this.model;

    if (!buidlingHeight || !Number(buidlingHeight) || buidlingHeight % 1 != 0) {
      this.errorMessage = 'You need to tell us how tall the building is in metres';
    } else if (buidlingHeight >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (buidlingHeight < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.heightHasError = false;
    }

    return !this.heightHasError;
  }
  override navigateNext(): Promise<boolean> {
    if (!this.inScope) {
      return this.navigationService.navigate(NotFoundComponent.route);
    }
    return this.navigationService.navigateRelative('prof-number-of-units', this.activatedRoute);
  }

  isInScope(adviceModel: AdviceModel) {
    var fewerThan7Stories = Number(adviceModel.NumberOfFloors) < 7;
    var lessThan18Meters = Number(adviceModel.BuildingHeight) < 18;

    return fewerThan7Stories && lessThan18Meters;

  }
}
