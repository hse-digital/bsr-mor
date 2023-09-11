import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './type-risk-reported.component.html'
})

export class TypeRiskReportedComponent extends PageComponent<string[]> {
  public static route: string = 'type-risk-reported';
  static title: string = "What type of risk are you reporting?";
  isOccupiedComplete: boolean = false


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    this.isOccupiedComplete = applicationService.model.Building?.BuildingType == "occupied" || applicationService.model.Building?.BuildingType == "complete_not_occupied" ? true : false;
    this.model = applicationService.model.Report.RiskReported ?? [];
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.RiskReported = this.model;
  }
  override canAccess(applicationService: ApplicationService, routeSnapshot: ActivatedRouteSnapshot): boolean {
    return true;
  }

  modelValid: boolean = false;

  override isValid(): boolean {
    this.modelValid = this.model!.length > 0;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigate('');
  }
}
