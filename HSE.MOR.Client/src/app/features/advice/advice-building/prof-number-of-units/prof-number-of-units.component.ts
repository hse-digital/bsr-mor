import { Component } from '@angular/core';
import { PageComponent } from '../../../../helpers/page.component';
import { AdviceModel, ApplicationService } from "../../../../services/application.service";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { NotFoundComponent } from '../../../../components/not-found/not-found.component';

@Component({
  templateUrl: './prof-number-of-units.component.html'
})

export class ProfNumberOfUnitsComponent extends PageComponent<number> {
  public static route: string = 'prof-number-of-units';
  static title: string = "Number of residential units";
  inScope: boolean = true;

  constructor(activatedRoute: ActivatedRoute, applicationService: ApplicationService) {
    super(activatedRoute);
  }
  override onInit(applicationService: ApplicationService): void {
    this.model = applicationService.model.Advice.NumberOfUnits;
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Advice.NumberOfUnits = this.model;
    this.inScope = this.isInScope(applicationService.model.Advice);
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return Number(applicationService.model.Advice.NumberOfFloors) < 7 && Number(applicationService.model.Advice.BuildingHeight) < 18;
  }
  unitsHasError = false;
  errorMessage: string = 'You need to tell us how many residential units the building has';

  override isValid(): boolean {
    this.unitsHasError = true;
    let residentialUnits = this.model;

    if (!residentialUnits || !Number(residentialUnits) || residentialUnits % 1 != 0) {
      this.errorMessage = 'You need to tell us how many residential units the building has';
    } else if (residentialUnits >= 1000) {
      this.errorMessage = 'Enter a whole number below 999';
    } else if (residentialUnits < 1) {
      this.errorMessage = 'Enter a whole number above 0';
    } else {
      this.unitsHasError = false;
    }

    return !this.unitsHasError;
  }

  override navigateNext(): Promise<boolean> {
    if (!this.inScope) {
      return this.navigationService.navigate(NotFoundComponent.route);
    }
    return this.navigationService.navigateRelative('confirmation', this.activatedRoute);
  }

  isInScope(adviceModel: AdviceModel) {
    var fewerThan7Stories = Number(adviceModel.NumberOfFloors) < 7;
    var lessThan18Meters = Number(adviceModel.BuildingHeight) < 18;

    var criteria1 = fewerThan7Stories && lessThan18Meters;
    var criteria2 = Number(adviceModel.NumberOfUnits) > 1;

    return criteria1 && criteria2;
  }
}
