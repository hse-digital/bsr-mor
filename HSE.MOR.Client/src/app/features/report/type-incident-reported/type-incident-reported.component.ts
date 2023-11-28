import { Component, ViewChild } from '@angular/core';
import { PageComponent } from '../../../helpers/page.component';
import { ApplicationService } from "../../../services/application.service";
import { FieldValidations } from "../../../helpers/validators/fieldvalidations";
import { ActivatedRoute, ActivatedRouteSnapshot } from "@angular/router";
import { GovukCheckboxComponent } from 'hse-angular';
import { IncidentDetailsComponent } from '../incident-details/incident-details.component';

@Component({
  templateUrl: './type-incident-reported.component.html'
})

export class TypeIncidentReportedComponent extends PageComponent<string[]> {
  public static route: string = 'type-incident-reported';
  static title: string = "What type of safety occurrence do you want to report? - Submit a mandatory occurrence notice and report";
  isProffesional: boolean = false
  errorAnchorId?: string;

  @ViewChild(GovukCheckboxComponent) checkboxGroup?: GovukCheckboxComponent;

  override onInit(applicationService: ApplicationService): void {
    if (!applicationService.model.Report) {
      applicationService.model.Report = {};
    }
    this.isProffesional = applicationService.model.Report!.OrgRole == "principal_contractor" || applicationService.model.Report!.OrgRole == "principal_designer" ? true : false;
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
    this.errorAnchorId = `type-incident-reported-structure-failure-${this.checkboxGroup?.innerId}`;
    return this.modelValid;
  }

  override navigateNext(): Promise<boolean> {
    return this.navigationService.navigateRelative(IncidentDetailsComponent.route, this.activatedRoute);
  }
}
