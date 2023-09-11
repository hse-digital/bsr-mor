import { Component } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";

@Component({
  templateUrl: './type-incident-reported.component.html'
})

export class TypeIncidentReportedComponent extends PageComponent<string[]> {
  public static route: string = 'type-incident-reported';
  static title: string = "What type of incident are you reporting?";
  isOccupiedComplete: boolean = false


  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    this.isOccupiedComplete = applicationService.model.Building?.BuildingType == "occupied" || applicationService.model.Building?.BuildingType == "complete_not_occupied" ? true : false;
    this.model = applicationService.model.Report.IncidentReported ?? [];
  }
  override async onSave(applicationService: ApplicationService): Promise<void> {
    applicationService.model.Report!.IncidentReported = this.model;
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
